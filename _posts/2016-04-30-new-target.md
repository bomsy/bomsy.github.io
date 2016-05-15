---
layout: post
title: new.target property
published: true
comments: true
---

As part of the ES2015 goodies we get the `new.target` property. In JavaScript, functions are invoked as constructors when called with the `new` keyword.
The `this` value for a constructor function is the object returned by the function, for a normal function `this` would be the global object. if a constructor
function is mistakenly called without the `new` keyword, `this` becomes the global object, causing unexpected issues.
<!--more-->
To protect against this, prior to ES2015 the `instanceof` operator was used as shown below

        function Foo() {
          if (!(this instanceof Foo)) {
            throw 'Foo must be called with new';
          }
        }

The `instanceof` operator just *checks if the prototype of the constructor function can be found on the prototype chain of the object*. If that's the case,
we know the object is an instance of that constructor.

### new.target
The `new.target` property also allows us determine if a function or constructor has been invoked with the `new` keyword. An interesting note, is that `new.target` is a meta
property avaliable to all functions and not a `target` property on some sort of `new` object ( impossible since `new` is reserved ) i.e `new.target !== new[target]`.

For functions not invoked with the `new` keyword, `new.target` is `undefined`.

        function Test() {
          console.log(new.target);
        }

        Test(); // logs undefined
        new Test(); // logs "Test" object

For class constructors ( ES2015 classes ), `new.target` is the constructor directly invoked by the `new` keyword, this also applies to subclasses where the parent class
constructor is delegated from the child class constructor.

        class Parent {
          constructor() {
            console.log(new.target);
          }
        }

        class Child extends Parent {
          constructor() {
            super();
          }
        }

        new Parent(); // logs "Parent" object
        new Child(); // logs "Child" object

For arrow functions, the `new.target` will always refer to the `new.target` of its immediate enclosing function.

        function Foo() {
          console.log('enclosing function ->', new.target);
          (() => console.log('inner arrow function ->', new.target))();
        }

We can now rewrite the the first sample code which uses `instanceof` to look like this instead

          function Foo() {
            if (!new.target) {
              throw 'Foo must be called with new';
            }
          }

----
References

1. [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)
2. [ECMAScript 2015 Standard](http://www.ecma-international.org/ecma-262/6.0/#sec-built-in-function-objects-construct-argumentslist-newtarget)
