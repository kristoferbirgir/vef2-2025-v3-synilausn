import { z } from 'zod';
import type { Slug } from '../types.js';

/**
 * Slugify a string.
 * @param text Text to slugify
 * @returns Slugified string or `null` if the text cannot be slugified
 */
export function slugify(text: string): Slug | null {
  const slug = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

  if (!validateSlug(slug)) {
    return null;
  }

  return slug;
}

export const SlugSchema = z.string().min(3).max(255);

/**
 * Validate a slug.
 * Slug is a "branded" type, a string that is guaranteed to be a slug.
 * @see https://www.learningtypescript.com/articles/branded-types
 */
export function validateSlug(slug: unknown): slug is Slug {
  try {
    SlugSchema.parse(slug);
    return true;
  } catch (error) {
    return false;
  }
}
