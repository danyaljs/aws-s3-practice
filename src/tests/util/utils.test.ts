import { extractErrorConstraints } from '../../app/util/utils';

describe('util', () => {
  describe('extractErrorConstraints', () => {
    test('should correctly extract error constraints from ValidationErrors', () => {
      const errors = [
        { property: 'prop1', constraints: { prop1: 'Error 1', prop2: 'Error 2' } },
        { property: 'prop3', children: [{ property: 'prop3', constraints: { prop3: 'Error 3' } }] },
      ];

      const extractedConstraints = extractErrorConstraints(errors);

      expect(extractedConstraints).toEqual([{ prop1: 'Error 1', prop2: 'Error 2' }, { prop3: 'Error 3' }]);
    });
  });
});
