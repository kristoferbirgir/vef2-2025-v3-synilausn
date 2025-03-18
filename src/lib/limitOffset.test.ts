import { describe, expect, test } from 'vitest';
import { parseLimitOffset } from './limitOffset.js';

describe('limitOffset', () => {
  test('valid data should return valid object', () => {
    const limit = 10;
    const offset = 0;

    const slug = parseLimitOffset(limit, offset);

    expect(slug).toEqual({ limit, offset });
  });

  test('invalid limit should return null', () => {
    const limit = -1;
    const offset = 0;

    const slug = parseLimitOffset(limit, offset);

    expect(slug).toBe(null);
  });

  test('invalid offset should return null', () => {
    const limit = 10;
    const offset = -1;

    const slug = parseLimitOffset(limit, offset);

    expect(slug).toBe(null);
  });
});
