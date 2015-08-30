/*
 * Morpher - JavaScript AST transformer and code generator
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/morpher
 *
 * Released under the MIT license
 * https://github.com/asmblah/morpher/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('lodash');

function Morpher() {

}

_.extend(Morpher.prototype, {
    morph: function (code, ast, fn) {
        var chars = code.split('');

        (function walk(node, parent) {
            var i,
                length,
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

            if (node.type) {
                fn(node, parent, replace, source);
            }

            if (_.isArray(node)) {
                for (i = 0, length = node.length; i < length; i++) {
                    walk(node[i], node);
                }
            } else if (typeof node === 'object') {
                for (i in node) {
                    if (node.hasOwnProperty(i)) {
                        walk(node[i], node);
                    }
                }
            }
        }(ast, null));

        return chars.join('');
    }
});

module.exports = Morpher;
