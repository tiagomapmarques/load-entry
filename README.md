# load-entry
Package to offload the execution of a function, object or module.

By default, if there's a document (i.e. on browsers), it will wait for the
'DOMContentLoaded' event and then execute the given object. If not it will
execute the object immediately.

## Why I use it on the browser
To create modules that are testable in any scenario.

## Why I use it on a NodeJs app
To facilitate module running and unit testing.

## Basic Usage (browser)

```javascript
// index.js -> app entry file
import loadEntry from 'load-entry';
import App from './App';

const myEntryPoint = () => {
  App.run(); // -> executed only after the document triggers 'ready'
};

loadEntry(myEntryPoint);
```

## More examples
Also runs these examples seamlessly:

```javascript
// Example 1: object with init function
const myEntryPoint = {
  init: () => {
    App.run();
  }
};
loadEntry(myEntryPoint);

// Example 2: object with custom init function
const myEntryPoint = {
  myInit: () => {
    App.run();
  }
};
loadEntry(myEntryPoint, 'myInit');
// OR
loadEntry(myEntryPoint, { init: 'myInit' });

// Example 3: module with default as export
// entry.js
export default () => {
  App.run();
};
// index.js
import Entry from './entry';
loadEntry(Entry);

// Example 4: module with named exports
// entry.js
export const myEntryPoint = () => {
  App.run();
};
export const mySecondEntryPoint = () => {
  console.log('This also runs!');
};
// index.js
import Entry from './entry';
loadEntry(Entry);

// Example 5: run after a custom event is triggered
const myEntryPoint = () => {
  App.run();
};
loadEntry(myEntryPoint, { event: 'MyCustomEvent' });

// Example 6: run immediately (in a browser environment)
const myEntryPoint = () => {
  App.run();
};
loadEntry(myEntryPoint, { event: null });
```
