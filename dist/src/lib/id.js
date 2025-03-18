import { z } from 'zod';
const IdSchema = z.coerce.number().int().positive();
/**
 * Parse a potential id into a branded Id.
 * @param id a potential id
 * @returns a valid Id or null
 */
export function parseId(id) {
    const parsedId = IdSchema.safeParse(id);
    if (!parsedId.success) {
        return null;
    }
    return parsedId.data;
}
