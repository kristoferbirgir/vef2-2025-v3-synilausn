import { z } from 'zod';
import type { CategoryToCreate } from './types.js';

export const CategoryCreateSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Name is required and should be between 3 and 255 characters',
    })
    .max(255, {
      message: 'Name is required and should be between 3 and 255 characters',
    }),
}) satisfies z.Schema<CategoryToCreate>;

export const AnswerCreateSchema = z.object({
  text: z
    .string()
    .min(3, {
      message: 'text is required and should be between 3 and 1024 characters',
    })
    .max(1024, {
      message: 'text is required and should be between 3 and 1024 characters',
    }),
  correct: z.boolean(),
});

export const QuestionCreateSchema = z.object({
  text: z
    .string()
    .min(3, {
      message: 'text is required and should be between 3 and 1024 characters',
    })
    .max(1024, {
      message: 'text is required and should be between 3 and 1024 characters',
    }),
  categoryId: z.number(),
  answers: z
    .array(AnswerCreateSchema)
    .min(4, {
      message: 'answers is required and should be an array of 4 items',
    })
    .max(4, {
      message: 'answers is required and should be an array of 4 items',
    }),
});
