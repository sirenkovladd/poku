import assert from 'node:assert';
import { test } from 'vitest';
import { sum } from '../../src/sum.js';

test('should add 2 + 2', () => {
  assert.equal(sum(2, 2), 4);
});
