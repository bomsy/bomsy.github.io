---
layout: post
title: how we use babel - empty lines 
published: false
comments: true
---

The firefox debugger has undergone a massive rewrite in the last two years, moving away from old mozilla specific technologies like xul etc, to more morden technologies like react, webpack and BABEL. 
<!--more-->

Babel is a tool for compiling Javascript into Javascript. It generates an Abstract Syntax Tree (AST) which can be transformed, transversed or manipulated in various ways for use.  Babel  and AST's have played a major part in growth of the mordern web tooling ecosystem. For in depth details see placeholder for babel docs

Over the past year, we have used babel extensively in building the debugger, from disabling non-executable lines so breakpoints cannot be set on those lines to highlighting out of scope code etc

I felt it would be cool to write a couple of blog posts, documenting some of our coolest use cases and go into some debbuger internals as we go.

And by the way the firefox devtools is really cool now, you should try it! 😉

In this blog post, we will look at one of our simple use cases. 

### Use Case One: Empty Lines

##### Problem

With empty lines , we want to disable the lines in the editor that do not have executable code so breakpoints can't be set where not useful (as shown in the figure below). 

![Screen Shot 2017-09-22 at 14.01.30](/assets/imgs/code_view.png)

The grayed out lines number, indicate which lines are disabled.

In the next section, we will look into the technical details of how this is achieved.

##### Solution

At a high level, we parse the source, and get an Abstract Syntax Tree (AST), which is used to get the data for the disabled lines which the UI uses to handle renders.  

Firstly, when any source file (in this case `todo.js` ) is selected and displayed, a call is made to the `getEmptyLines` function passing the source object which contains all the data about the source selected.

```js
export default function getEmptyLines(sourceToJS) {
  if (!sourceToJS) {
    return null;
  }

  const ast = getAst(sourceToJS);
  if (!ast || !ast.comments) {
    return [];
  }
  ...
  // more code to get to later
}
```

This takes the source and tries to get the AST for it by calling the`getAst` function.

`getAst`  parses the source using the Babylon parser, adds the generated AST to the cache, and returns the AST, as shown below

```js
...
import * as babylon from "babylon";
...

let ASTs = new Map();

function parse(code, opts) {
  return babylon.parse(
    code, Object.assign({}, opts, {
      sourceType: "module",
      ...
    })
  );
}
                        
...
                        
// Parse the source and return the AST
export function getAst(source: Source) {
  if (!source || !source.text) {
    return {};
  }

  if (ASTs.has(source.id)) {
    return ASTs.get(source.id);
  }

  let ast = {};
  if (source.contentType == "text/html") {
    ...
  } else if (source.contentType == "text/javascript") {
    ast = parse(source.text);
  }
  ASTs.set(source.id, ast);
  return ast;
}
```

Once we have the AST, we can do a lot of poweful things. The screenshot below shows a part of what the AST for `todo.js` looks like.   

####  AST

![Screen Shot 2017-09-27 at 13.21.49](/assets/imgs/ast_view.png)

For a complete view of the AST [check this out]( https://astexplorer.net/#/gist/8ef7a7ea2124d997984e7cea06ab9ae4/16ffabe564617bca00acc693d406961ecf718f46). 

Yay, we have our AST!

Back to our `getEmptyLines` function ... next we want to get an array of lines that have executable code by calling `getExecutableLines` , then get an array of all the lines for the source by calling `getLines` . The difference of both gives our array of empty lines. 

```js
export default function getEmptyLines(sourceToJS) {
  // code to get the ast as shown above
  ...
  const executableLines = getExecutableLines(ast);
  const lines = getLines(ast);
  return difference(lines, executableLines);
}
```

`getExecutable` takes the tokens from the AST, and simply filters out all comment or EOF tokens, and since only the lines are needed, it maps over results returning just the start lines. Now! There will be lines with multiple tokens, this will cause a line to show up more than once in the array, so it makes sure the lines are unique before returning the array.

```js

const commentTokens = ["CommentBlock", "CommentLine"];
...

// The following sequence stores lines which have executable code
// (contents other than comments or EOF, regardless of line position)
function getExecutableLines(ast) {
  const lines = ast.tokens
    .filter(
      token =>
        !commentTokens.includes(token.type) &&
        (!token.type || (token.type.label && token.type.label != "eof"))
    )
    .map(token => token.loc.start.line - 1);

  return uniq(lines);
}
```

Now we have our executable lines, `getLines`  returns an array of all the lines in source, from 0 to the end line on the last token in the AST.

```js
...

function fillRange(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((item, index) => start + index);
}

// Populates a pre-filled array of every line number,
function getLines(ast) {
  return fillRange(0, ast.tokens[ast.tokens.length - 1].loc.end.line);
}
```

Once all the neccesarry line data is gotten, the difference in the two line arrays is determined  using the lodash `difference`  utility function.

```js
export default function getEmptyLines(sourceToJS) {
  // code as shown above
  ...
  return difference(lines, executableLines);
}

```

Our `getEmptyLines` function handles the bulk of the work, all that is left, is to pass the data to the react component to be rendered (this is out of our scope). 

Its also worth mentioning that `getEmptylines ` is run in a web worker to handle the performance hit that might be encountered when processing really large files over thousands of  lines found in the wild.

So finally here is what the array of empty lines for the `todo.js` file

```js
[0, 2, 5, 6, 7, 8, 9, 11, 12, 17, 18, 26, 27]
```

Does this match our disabled lines in the figure above?

 Yay it does! Taking into consideration that our code mirror lines are 1 based (start from 1 rather than 0)



#### Conclusion

We are still refining most of the code and fixing bugs. This just shows how it works generally. Babel and AST