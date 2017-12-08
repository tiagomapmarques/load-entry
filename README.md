# load-entry
Package to offload the execution of a function, object or module to after the
document finished loading.

## Basic Usage

```javascript
// index.js -> app entry file
import loadEntry from 'load-entry';
import App from './App';

const myEntryPoint = () => {
  App.run(); // -> executed only after the document triggers 'ready'
};

loadEntry(myEntryPoint);
// want to create a proper test for this entry point?
// just mock 'load-entry' and run/access it on demand (on a beforeEach?)
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
  console.log('This is also run!');
};
// index.js
import Entry from './entry';
loadEntry(Entry);
```

## Why I use it
To create app entry points that are modular and testable.
