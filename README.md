Morpher
=======

[![Build Status](https://secure.travis-ci.org/asmblah/morpher.png?branch=master)](http://travis-ci.org/asmblah/morpher)

JavaScript AST transformer and code generator, optimized for older engines.

Inspired by Falafel (https://github.com/substack/node-falafel),
but modified for performance in older JavaScript engines (eg. IE8.)

Example
-------
```javascript
var code = 'var result = 1 + 2;';
var ast = acorn.parse(code, {ranges: true});
var transpiledCode = morpher.morph(code, ast, function (node, parent, replace, source) {
    if (node.type === 'BinaryExpression') {
        replace(node, 'postProcess(' + source(node) + ')');
    }
});
console.log(transpiledCode); // Outputs `var result = postProcess(1 + 2);`
```

Keeping up to date
------------------
- [Follow me on Twitter](https://twitter.com/@asmblah) for updates: [https://twitter.com/@asmblah](https://twitter.com/@asmblah)
