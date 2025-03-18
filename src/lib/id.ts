import { z } from 'zod';
import type { Id } from '../types.js';

const IdSchema = z.coerce.number().int().positive();

/**
 * Parse a potential id into a branded Id.
 * @param id a potential id
 * @returns a valid Id or null
 */
export function parseId(id: unknown): Id | null {
  const parsedId = IdSchema.safeParse(id);

  if (!parsedId.success) {
    return null;
  }

  return parsedId.data as Id;
}
