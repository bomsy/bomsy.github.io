---
layout: post
title: Spying on fake promises
published: true
comments: true
---
Ran into an issue today, which took me a little bit of time to figure out...<!--more-->

Over time i've discovered that documenting experiences has a way of providing perspective,
greater insight and you can help others while at it.

So here's my experience trying to spy on a function that returns a promise


### Problem
I was trying to test some code which looks something like this
```js
$scope.loadItems = function() {
  var opts = {
    ...
  };
  Service.getItems(opts)
    .then(...);
};
```

`Service.getItems` gets the items by making an http request and returns a promise.
Testing its workings is done some where else, so i just needed to mock it for my use.

A mock of the service looks like this
```js
...
var MockService = {
  getItems: function(options) {
    return {
      then: function() {}
    }
  }
};
...
```

Then the test for `$scope.loadItems`

```js
it('should load items', function() {
  ...
  var itemsSpy = spyOn(Service, 'getItems');
  $scope.loadItems();
  expect(itemsSpy).toHaveBeenCalledWith(...);
});
...
```

Basically, i spy on `getItems`, then i call the `loadItems` which should call the `getItems`,
which returns a promise of which when resolved, the `.then` get's called. Finally i check if
getItems was called.

While running the tests, i got following error

```js
TypeError: 'undefined' is not an object (evaluating 'Service.getItems(opts).then').
```

This would mean that `getItems` returns `undefined`, instead of the promise object which has got the
`.then` function on it, how could this be?

### Solution

Digging deep, i noticed that it becomes `undefined` after the spy gets set.

What was the spy doing? Looking into how spies work, the key to spying is that the function been
spied on gets monkey patched with the some code, enabling the spy to determine when the function
 gets called.

Now that would be the cause of my issue. The spy monkey patches my mock `getItems` function so that
it no longer returns the promise, then when `.then` gets called in `$scope.loadItems` it can't be found,
causing the error above.

How do we fix this?

My goal is to be able to spy on the function, but also to maintain its
original behavior (and return the promise with the expected `.then`).


Jasmine allows do stuff when the function being spied on gets called. One of the things
we can do is call a fake function using `.and.callFake()`.

We can now call a function to do what our original function was to do before it got spied on.

So the code for the `$scope.loadItems` test becomes

```js
it('should load items', function() {
  ...
  var itemsSpy = spyOn(Service, 'getItems')
    .and.callFake(function() {
      return {
        then: function() {}
      }
    });
  $scope.loadItems();
  expect(itemsSpy).toHaveBeenCalledWith(...);
});
...
```

and voila!

Hope this helps someone!
