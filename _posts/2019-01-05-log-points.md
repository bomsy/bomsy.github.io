---
layout: post
title: Debugging using log points
published: true
comments: true
---

Logging has been the staple for debugging since the beginning of time. You place a log statement of
which some form at position in the code file and it

<!--more-->

Every web developer needing to debug a web app has used `console.log` t
A typical workflow would be add a `console.log` to code file, run the page in the
browser ,open up the browser devtools console to see the output of the `console.log`.
This process is repeated as much as needed until the issue being debugged is solved.

Some of the issues with this workflow

- The constant context switching between code editor and browser developer tools
- The littering of the code with console logs

We can do better! i'm think any action relating to debugging should be done in the debugger.

Enter Log points! These just landed in firefox nightly last week. They are added
just as you would add a typical breakpoint

![][log-points-4]
![][log-points-2]
![][log-points-3]

[log-points-4]: /assets/imgs/log-points-4.png
[log-points-2]: /assets/imgs/log-points-2.png
[log-points-3]: /assets/imgs/log-points-3.png
