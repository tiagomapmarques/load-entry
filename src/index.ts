import { Module, ModuleObject, Configuration, ConfigurationInput } from './types';

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

const executeEntry = (entry: Module, defaultInit: string) => {
  if (typeof entry === 'function') {
    execute(entry, defaultInit);
  } else if (entry.default) {
    execute(entry.default, defaultInit);
  } else {
    Object.keys(entry).forEach((key) => entry[key] && execute(entry[key] as ModuleObject, defaultInit));
  }
};

const loadEntry = (entry: Module, config?: ConfigurationInput | string) => {
  const finalConfig: Configuration = {
    event: 'DOMContentLoaded',
    init: 'init',
    ...((typeof config === 'string' ? { init: config } : config) || {}),
  };

  if (document && document.addEventListener && finalConfig.event) {
    document.addEventListener(finalConfig.event, () => executeEntry(entry, finalConfig.init));
  } else {
    executeEntry(entry, finalConfig.init);
  }
};

// tslint:disable-next-line:no-default-export
export default loadEntry;
