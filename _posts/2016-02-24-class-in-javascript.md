---
layout: post
title: internal class property in JavaScript
published: true
comments: true
---

The ECMAScript standard specifies internal properties...<!--more-->, some of which are common to all JavaScript objects.

These are invisible properties which exist solely for specification purposes.

The `[[Class]]` is one of such. Some others include `[[Prototype]]`, `[[Get]]`, `[[Put]]` etc. For a complete set of these properties
see the ECMAScript standard. These properties are used to define the semantics of the object values.

### `[[Class]]` property

The `[[Class]]` property stores a string  which defines the kind of object. Function objects  have the `[[Class]]` value  "Function", Date objects have the
`[[Class]]` value "Date", Object objects have the `[[Class]]` value "Object" and so on. The table below ( taken from Dave Herman's book "Effective JavaScript" )
shows the `[[Class]]` values and corresponding constructors matching the types of objects.


|[[Class]]	| Construction
|-----------|:----------------
|"Array"	  | `new Array()`, `[]`
|"Boolean"	| `new Boolean()`
|"Date"	    | `new Date()`
|"Error"	  | `new Error()`, `new RangeError()` etc
|"Function"	| `new Function()`
|"JSON"	    | `JSON`
|"Math"	    | `Math`
|"Number"	  | `new Number()`
|"Object"	  | `new Object()`, `{}`
|"RegExp"	  | `new RegExp()`
|"String"	  | `new String()`


### Determine the `[[Class]]` value in JavaScript
In JavaScript the "Object.prototype.toString" method returns the string representation of the object. Internally it queries the `[[Class]]` property and uses
its value as part of  the string generated for the receiver. This can be seen in the example below:-

```js
  var d = new Date();
  var o = {};
  var a = [];

  Object.prototype.toString.call(d); // [object Date]
  Object.prototype.toString.call(o); // [object Object]
  Object.prototype.toString.call(a); // [object Array]
```

These internal properties are essential in *defining the behaviour of objects*, An example would be if an object is not a pure array ( i.e the `[[Class]]` property
value is specified as “Array” ) there are no guarantees on the behaviour of its methods and the value of its properties.

In the example below the `concat` method of the array object depends on the value of the `[[Class]]` property, if an argument passed into the method is a true array
it concatenates its contents to that of the result else it adds it as a single object.

```js
// True array
['a','b','c'].concat(['4','5','6']); // ["a", "b", "c", "4", "5", "6"]

// arguments is not a true array
function fakeArray(){
    return ['a','b','c'].concat(arguments);
}
fakeArray('4','5','6'); // ["a", "b", "c", { 0:'4', 1:'5', 2:'6'}]
```
----
References

1. [ECMAScript Standard](http://www.ecma-international.org/ecma-262/6.0/index.html)
2. Effective JavaScript by Dave Herman
