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

describe('Morpher function expression replacement handling', function () {
    _.each({
        'wrapping anonymous function expression in a ternary': {
            code: nowdoc(function () {/*<<<EOS
var myFunc = function () {
    // This is my func
    return 21 + 2;
};

EOS
*/;}), // jshint ignore:line
            fn: function (node, parent, replace, source) {
                if (node.type === 'FunctionExpression') {
                    replace(node, '1 === 1 ? ' + source(node) + ' : null');
                }
            },
            expectedResult: nowdoc(function () {/*<<<EOS
var myFunc = 1 === 1 ? function () {
    // This is my func
    return 21 + 2;
} : null;

EOS
*/;}), // jshint ignore:line
        }
    }, tools.check);
});
