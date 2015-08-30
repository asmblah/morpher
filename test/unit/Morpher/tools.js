/*
 * Morpher - JavaScript AST transformer and code generator
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/morpher
 *
 * Released under the MIT license
 * https://github.com/asmblah/morpher/raw/master/MIT-LICENSE.txt
 */

'use strict';

var acorn = require('acorn'),
    Morpher = require('../../../src/Morpher');

module.exports = {
    check: function (scenario, description) {
        describe(description, function () {
            beforeEach(function () {
                this.morpher = new Morpher();
            });

            it('should return the expected result', function () {
                var ast = acorn.parse(scenario.code, {ranges: true});

                expect(this.morpher.morph(scenario.code, ast, scenario.fn))
                    .to.equal(scenario.expectedResult);
            });
        });
    }
};
