# Interval

A simple OOP-style wrapper for `setInterval`.

```javascript
var Interval = require('af-interval');

var timer = new Interval(function(){
    console.log(new Date().toISOString());
},1000,true); // every 1s, automatically start

timer.pause(); // pause it

timer.resume(); // resume it

timer.unref(); // unref it

timer.ref(); // re-ref it

// ... and more

// auto-start is optional, defaults to false
new Interval(function(){},1000);
```
