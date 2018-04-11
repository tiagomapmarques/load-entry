
declare module 'load-entry' {
  interface IndexObject<T> {
    [key: string]: T;
  }

  type ModuleObject = Function | IndexObject<Function>;

  interface ESModule extends IndexObject<ModuleObject | undefined> {
    default?: ModuleObject;
  }

  export type Module = Function | ESModule;

  export interface Configuration {
    event?: string;
    init?: string;
  }

  export default function (entry: Module, config?: Configuration): void;
}
