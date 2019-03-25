---
layout: post
title: Debugging using log points
published: true
comments: true
---

Logging has been the staple for debugging since the beginning of time. You place a log or print statement of
some form at position in the code file and it

<!--more-->

Every web developer needing to debug a web app have used or still use `console.log` heavily.
A typical workflow would be

- add a `console.log` with an expression to code file e.g `console.log(foo === true)`
- switch over to the browser to display the page
- open up the browser devtools console to see the output logged.
  This process is repeated as much as needed until the issue being debugged is solved.

Some of the issues with this workflow

- The **repeated context switching** between code editor and browser developer tools
- The **littering of the code with console logs**

We can do better! i'm think any action relating to debugging should be done in the debugger.

Enter log points!

### Log points

These are a special kind of breakpoint that when set, never get hit, rather they log the results of
the expression to the console.

They recently landed in Firefox 67.

With log points

- **No need to context switch**, once in the debugger, the developer can focus on figuring out the issue,
  without having to switch back and forth between the browser developer tool and the code editor. This increases productivity.

- **No littering with console logs** since the logging is now done in the debugger, no need to litter the code with
  console logs, eliminating the risk of rouge console logs getting into production code.

#### To add log points

- Open the desired code file in browser devtools debugger.
- Right click on the gutter at the specific line and select `Add log`.

  ![][log-points-4]

- In the input panel enter the expression to log
- press the enter key

  ![][log-points-2]

- A log point is added to the gutter, and to the breakpoints panel. Log points are coloured purple to distinguish them from
  normal and conditional breakpoints.

  ![][log-points-3]

  ### Conclusion

  Debug related tasks should be done in the debugger rather in the code.

[log-points-4]: /assets/imgs/log-points-4.jpeg
[log-points-2]: /assets/imgs/log-points-2.jpeg
[log-points-3]: /assets/imgs/log-points-3.jpeg
