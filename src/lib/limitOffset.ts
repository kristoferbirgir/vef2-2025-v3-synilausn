import { z } from 'zod';
import {
  LIMIT_DEFAULT,
  LIMIT_MAX,
  OFFSET_DEFAULT,
  OFFSET_MAX,
} from '../constants.js';
import type { LimitOffset } from '../types.js';

// Use zod coerction to transform whatever value we get into a number, then use
// Zod parser to ensure the number is an integer and positive.
// @see https://zod.dev/?id=coercion-for-primitives

export const LimitSchema = z.coerce.number().int().positive().max(LIMIT_MAX);
export const OffsetSchema = z.coerce
  .number()
  .int()
  .positive()
  .min(0)
  .max(OFFSET_MAX);

/**
 *
 * @param requestedLimit Incoming limit value
 * @param requestedOffset
 * @returns
 */
export function parseLimitOffset(
  requestedLimit: unknown,
  requestedOffset: unknown,
): LimitOffset | null {
  let limit = LIMIT_DEFAULT;
  let offset = OFFSET_DEFAULT;

  try {
    if (requestedLimit) {
      limit = LimitSchema.parse(requestedLimit);
    }

    if (requestedOffset) {
      offset = OffsetSchema.parse(requestedOffset);
    }
  } catch (error) {
    return null;
  }

  return {
    limit,
    offset,
  };
}
