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

describe('Morpher function declaration replacement handling', function () {
    _.each({
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
