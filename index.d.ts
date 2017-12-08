
declare module 'load-entry' {
  interface IndexObject<T> {
    [key: string]: T;
  }

  type ModuleObject = Function | IndexObject<Function>;

  interface ESModule extends IndexObject<ModuleObject | undefined> {
    default?: ModuleObject;
  }

  type Module = Function | ESModule;

  export default function (entry: Module, defaultInit?: string): void;
}
