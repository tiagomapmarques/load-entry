import { Module, ModuleObject } from './types';

const execute = (module: ModuleObject, defaultInit: string) => {
  if (typeof module === 'function') {
    module();
  // tslint:disable-next-line:strict-type-predicates
  } else if (typeof module[defaultInit] === 'function') {
    module[defaultInit]();
  } else {
    throw new Error(`Entry does not export function nor object with "${defaultInit}" function`);
  }
};

const loadEntry = (entry: Module, defaultInit = 'init') => document.addEventListener('DOMContentLoaded', () => {
  if (typeof entry === 'function') {
    execute(entry, defaultInit);
  } else if (entry.default) {
    execute(entry.default, defaultInit);
  } else {
    Object.keys(entry).forEach((key) => entry[key] && execute(entry[key] as ModuleObject, defaultInit));
  }
});

// tslint:disable-next-line:no-default-export
export default loadEntry;
