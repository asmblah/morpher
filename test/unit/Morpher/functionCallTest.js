/*
 * Morpher - JavaScript AST transformer and code generator
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/morpher
 *
 * Released under the MIT license
 * https://github.com/asmblah/morpher/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('lodash'),
    nowdoc = require('nowdoc'),
    tools = require('./tools');

describe('Morpher function call replacement handling', function () {
    _.each({
        'replacing a function call with an addition, including comment': {
            code: nowdoc(function () {/*<<<EOS
// This is my function call
var result = 10 * myFunc() / 4;

EOS
*/;}), // jshint ignore:line
            fn: function (node, parent, replace) {
                if (node.type === 'CallExpression') {
                    replace(node, '(4 + 2)');
                }
            },
            expectedResult: nowdoc(function () {/*<<<EOS
// This is my function call
var result = 10 * (4 + 2) / 4;

EOS
*/;}), // jshint ignore:line
        },
        'wrapping a subtraction with a function call, including comment': {
            code: nowdoc(function () {/*<<<EOS
// This is my expression
var result = 20 - 4;

EOS
*/;}), // jshint ignore:line
            fn: function (node, parent, replace, source) {
                if (node.type === 'BinaryExpression') {
                    replace(node, 'postProcess(' + source(node) + ')');
                }
            },
            expectedResult: nowdoc(function () {/*<<<EOS
// This is my expression
var result = postProcess(20 - 4);

EOS
*/;}), // jshint ignore:line
        },
        'wrapping only expressions inside functions': {
            code: nowdoc(function () {/*<<<EOS
// Expression 1
var result1 = 20 - 4;

function a() {
    // Expression 2
    var result2 = 30 - 2;
}

// Expression 3
var result1 = 40 - 6;

EOS
*/;}), // jshint ignore:line
            fn: function (node, parent, replace, source) {
                if (node.type === 'BinaryExpression' && node.inFunc) {
                    replace(node, 'process(' + source(node) + ')');
                }
            },
            breadthFirstFn: function (node, parent) {
                if (parent) {
                    node.inFunc = parent.inFunc;
                }

                if (node.type === 'FunctionDeclaration') {
                    node.inFunc = true;
                }
            },
            expectedResult: nowdoc(function () {/*<<<EOS
// Expression 1
var result1 = 20 - 4;

function a() {
    // Expression 2
    var result2 = process(30 - 2);
}

// Expression 3
var result1 = 40 - 6;

EOS
*/;}), // jshint ignore:line
        }
    }, tools.check);
});
