## WebLiero Stats Collector

[WebLiero](https://www.webliero.com/) does not have very detailed or permanent
built-in game statistics. Attach this code to your WebLiero session to get
them!

### Instructions
1. Generate the minified tracking code:
```
./make.sh && cat dist/liero.js.min | pbcopy
```
2. Paste the tracking code into your WebLiero page's dev console.
3. Initialize the code with:
```
var endCollection = startCollection();
```
4. At the end of your session, get the data with:
```
var data = endCollection();
```
