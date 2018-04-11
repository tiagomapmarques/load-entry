
export interface IndexObject<T> {
  [key: string]: T;
}

export type ModuleObject = Function | IndexObject<Function>;

export interface ESModule extends IndexObject<ModuleObject | undefined> {
  default?: ModuleObject;
}

export type Module = Function | ESModule;

export interface ConfigurationInput {
  event?: string;
  init?: string;
}

export interface Configuration {
  event: string;
  init: string;
}
