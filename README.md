Morpher
=======

[![Build Status](https://secure.travis-ci.org/asmblah/morpher.png?branch=master)](http://travis-ci.org/asmblah/morpher)

JavaScript AST transformer and code generator, optimized for older engines.

Inspired by falafel (https://github.com/substack/node-falafel)
and free-falafel (https://github.com/freethenation/node-falafel),
but modified for performance in older JavaScript engines (eg. IE8.)

AST traversal is leaf-first (so child nodes are visited before their parents.)

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

Use with a breadth-first callback
---------------------------------

To process parent nodes before their children, you can pass a second callback to `.morph(...)`:
```javascript
var code = 'var result = 1 + 2; function test() { return 2 + 3; }';
var ast = acorn.parse(code, {ranges: true});
var transpiledCode = morpher.morph(code, ast, function (node, parent, replace, source) {
    if (node.type === 'BinaryExpression' && node.inFunc) {
        replace(node, 'postProcess(' + source(node) + ')');
    }
}, function (node, parent) {
    if (parent) {
        node.inFunc = parent.inFunc;
    }

    if (node.type === 'FunctionDeclaration') {
        node.inFunc = true;
    }
});
console.log(transpiledCode); // Outputs `var result = 1 + 2; function test() { return postProcess(2 + 3); }`
```

Keeping up to date
------------------
- [Follow me on Twitter](https://twitter.com/@asmblah) for updates: [https://twitter.com/@asmblah](https://twitter.com/@asmblah)
