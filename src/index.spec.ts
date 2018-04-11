import { ConfigurationInput, Module } from './types';
import * as tsLoadEntry from './';
import * as jsLoadEntry from '../lib';

describe('load-entry', () => {
  let testFunction: jest.Mock;
  const testData = [
    {
      test: 'works for a function',
      inputGetter: () => testFunction,
      expectsError: false,
      browser: true,
      config: undefined,
    },
    {
      test: 'works for the defaut object',
      inputGetter: () => ({ default: testFunction }),
      expectsError: false,
      browser: true,
      config: undefined,
    },
    {
      test: 'works for the named exports',
      inputGetter: () => ({ myExport: testFunction }),
      expectsError: false,
      browser: true,
      config: undefined,
    },
    {
      test: 'works for the named exported objects',
      inputGetter: () => ({ myExport: { init: testFunction } }),
      expectsError: false,
      browser: true,
      config: undefined,
    },
    {
      test: 'works for custom objects (string)',
      inputGetter: () => ({ myExport: { myInit: testFunction } }),
      expectsError: false,
      browser: true,
      config: 'myInit',
    },
    {
      test: 'works for custom objects (object)',
      inputGetter: () => ({ myExport: { myInit: testFunction } }),
      expectsError: false,
      browser: true,
      config: {
        init: 'myInit',
      },
    },
    {
      test: 'works without document object',
      inputGetter: () => testFunction,
      expectsError: false,
      browser: false,
      config: undefined,
    },
    {
      test: 'works without a defined event',
      inputGetter: () => testFunction,
      expectsError: false,
      browser: true,
      config: {
        event: undefined,
      },
    },
    {
      test: 'throws an error if nothing is exported',
      inputGetter: () => ({ myExport: { notAnInitFunction: undefined } }),
      expectsError: true,
      browser: true,
      config: undefined,
    },
  ];
  let thrownError: Error;

  const executeTests = (expectsError: boolean, browser: boolean, config: ConfigurationInput) => {
    afterEach(() => {
      testFunction.mockClear();
    });

    if (browser) {
      if (!(Object.keys(config || {}).indexOf('event') >= 0) || (config || {}).event) {
        it(`waits for document event`, () => {
          expect((document.addEventListener as jest.Mock).mock.calls).toHaveLength(1);
          expect((document.addEventListener as jest.Mock).mock.calls[0][0]).toEqual((config || {}).event || 'DOMContentLoaded');
        });
      } else {
        it(`does not wait for document event`, () => {
          expect((document.addEventListener as jest.Mock).mock.calls).toHaveLength(0);
        });
      }
    }

    if (!expectsError) {
      it(`executes the given object`, () => {
        expect(testFunction.mock.calls).toHaveLength(1);
      });

      it(`does not pass any arguments`, () => {
        expect(testFunction.mock.calls[0]).toEqual([]);
      });
    } else {
      it(`throws an error`, () => {
        expect(thrownError).toBeTruthy();
      });
    }
  };

  const executeFor = (
    loadEntry: Function,
    inputGetter: () => Module,
    expectsError: boolean,
    browser: boolean,
    config?: ConfigurationInput | string,
  ) => {
    beforeEach(() => {
      try {
        if (config === undefined) {
          loadEntry(inputGetter());
        } else {
          loadEntry(inputGetter(), config);
        }
      } catch (error) {
        thrownError = error;
      }
    });

    executeTests(expectsError, browser, typeof config === 'string' ? { init: config } : config);
  };

  testData.forEach(({ test, inputGetter, expectsError, browser, config }) => {
    describe(test, () => {
      let originalAddEventListener;

      beforeEach(() => {
        originalAddEventListener = document.addEventListener;
        testFunction = jest.fn();
        document.addEventListener = browser ? jest.fn((_, callback) => callback()) : null;
      });

      afterEach(() => {
        document.addEventListener = originalAddEventListener;
      });

      describe('on typescript', () => executeFor(tsLoadEntry.default, inputGetter, expectsError, browser, config));

      describe('on javascript', () => executeFor(jsLoadEntry.default, inputGetter, expectsError, browser, config));
    });
  });
});
