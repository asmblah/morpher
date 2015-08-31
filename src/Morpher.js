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
    estraverse = require('estraverse');

function Morpher() {

}

_.extend(Morpher.prototype, {
    morph: function (code, ast, fn, breadthFirstFn) {
        var chars = code.split(''),
            toString = {}.toString,
            VisitorKeys = estraverse.VisitorKeys;

        if (!breadthFirstFn) {
            breadthFirstFn = function () {};
        }

        (function walk(node, parent) {
            var elementsLength,
                i,
                j,
                keys,
                keysLength,
                prop,
                replace = function (node, replacement) {
                    var i;

                    // Replace first char of original code for node
                    chars[node.range[0]] = replacement;

                    // Empty chars that represent the rest of the original node
                    // NB: Reverse loop for speed in old JS engines
                    // TODO: Investigate possible use of [].splice.apply(...) here for speed
                    for (i = node.range[1] - 1; i >= node.range[0] + 1; --i) {
                        chars[i] = '';
                    }
                },
                source = function (node) {
                    return chars.slice(node.range[0], node.range[1]).join('');
                };

            breadthFirstFn(node, parent, replace, source);

            keys = VisitorKeys[node.type];
            for (i = 0, keysLength = keys.length; i < keysLength; i++) {
                prop = node[keys[i]];

                if (prop.type) {
                    walk(prop, node);
                } else if (toString.call(prop) === '[object Array]') {
                    for (j = 0, elementsLength = prop.length; j < elementsLength; j++) {
                        walk(prop[j], node);
                    }
                }
            }

            fn(node, parent, replace, source);
        }(ast, null));

        return chars.join('');
    }
});

module.exports = Morpher;
