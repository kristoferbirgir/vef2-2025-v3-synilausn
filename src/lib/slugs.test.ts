import { describe, expect, test } from 'vitest';
import { slugify, validateSlug } from './slugs.js';

describe('slugs', () => {
  test('slug generated valid text', () => {
    const text = 'FOO bAr';

    const slug = slugify(text);

    expect(slug).toBe('foo-bar');
  });

  test('slug can only be generated from valid text', () => {
    const text = '';

    const slug = slugify(text);

    expect(slug).toBe(null);
  });

  test('slug must be at least three chars', () => {
    const slug = 'ab';

    const isValid = validateSlug(slug);

    expect(isValid).toBe(false);
  });

  test('slug must be at most 255 chars', () => {
    const slug = 'a'.repeat(256);

    const isValid = validateSlug(slug);

    expect(isValid).toBe(false);
  });
});
