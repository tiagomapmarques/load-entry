import * as tsLoadEntry from './';
import * as jsLoadEntry from '../lib';

describe('load-entry', () => {
  let testFunction: jest.Mock;
  const testData = [
    {
      test: 'works for a function',
      inputGetter: () => testFunction,
      expectsError: false,
      customInitFunction: undefined,
    },
    {
      test: 'works for the defaut object',
      inputGetter: () => ({ default: testFunction }),
      expectsError: false,
      customInitFunction: undefined,
    },
    {
      test: 'works for the named exports',
      inputGetter: () => ({ myExport: testFunction }),
      expectsError: false,
      customInitFunction: undefined,
    },
    {
      test: 'works for the named exported objects',
      inputGetter: () => ({ myExport: { init: testFunction } }),
      expectsError: false,
      customInitFunction: undefined,
    },
    {
      test: 'works for the named exported custom objects',
      inputGetter: () => ({ myExport: { myInit: testFunction } }),
      expectsError: false,
      customInitFunction: 'myInit',
    },
    {
      test: 'throws an error if nothing is exported',
      inputGetter: () => ({ myExport: { notAnInitFunction: undefined } }),
      expectsError: true,
      customInitFunction: undefined,
    },
  ];
  let thrownError: Error;

  beforeEach(() => {
    testFunction = jest.fn();
    document.addEventListener = jest.fn((_, callback) => callback());
  });

  const executeTests = (expectsError: boolean) => {
    afterEach(() => {
      testFunction.mockClear();
    });

    it(`waits for document load`, () => {
      expect((document.addEventListener as jest.Mock).mock.calls).toHaveLength(1);
      expect((document.addEventListener as jest.Mock).mock.calls[0][0]).toEqual('DOMContentLoaded');
    });

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

  testData.forEach(({ test, inputGetter, expectsError, customInitFunction }) => {
    describe(test, () => {
      let input;

      beforeEach(() => {
        input = inputGetter();
      });

      describe('on typescript', () => {
        beforeEach(() => {
          try {
            if (!customInitFunction) {
              tsLoadEntry.default(input);
            } else {
              tsLoadEntry.default(input, customInitFunction);
            }
          } catch (error) {
            thrownError = error;
          }
        });

        executeTests(expectsError);
      });

      describe('on javascript', () => {
        beforeEach(() => {
          try {
            if (!customInitFunction) {
              jsLoadEntry.default(input);
            } else {
              jsLoadEntry.default(input, customInitFunction);
            }
          } catch (error) {
            thrownError = error;
          }
        });

        executeTests(expectsError);
      });
    });
  });
});
