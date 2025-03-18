import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono';

import { parseId } from '../lib/id.js';
import { parseLimitOffset } from '../lib/limitOffset.js';
import { ConsoleLogger } from '../lib/logger.js';
import { QuestionsDbClient } from '../lib/questions.db.js';
import { validateSlug } from '../lib/slugs.js';
import { QuestionCreateSchema } from '../schema.zod.js';

export const questionsApi = new Hono();

const logger = new ConsoleLogger();
const questionsClient = new QuestionsDbClient(new PrismaClient(), logger);

questionsApi.get('/', async (c) => {
  const limitOffset = parseLimitOffset(
    c.req.query('limit'),
    c.req.query('offset'),
  );
  const categorySlug = c.req.query('category');

  if (categorySlug && !validateSlug(categorySlug)) {
    return c.json({ message: 'invalid category slug' }, 400);
  }

  if (!limitOffset) {
    return c.json({ message: 'invalid limit or offset' }, 400);
  }

  const questions = await questionsClient.getQuestions(
    limitOffset,
    categorySlug,
  );

  if (!questions.ok) {
    return c.json({ message: 'error fetching questions' }, 500);
  }

  return c.json(questions.value);
});

questionsApi.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'));

  if (!id) {
    return c.json({ message: 'invalid id' }, 400);
  }

  const question = await questionsClient.getQuestionById(id);

  if (!question.ok) {
    return c.json({ message: 'error fetching question' }, 500);
  }

  if (!question.value) {
    return c.json({ message: 'question not found' }, 404);
  }

  return c.json(question.value);
});

questionsApi.post('/', zValidator('json', QuestionCreateSchema), async (c) => {
  const question = c.req.valid('json');

  const createResult = await questionsClient.createQuestion({
    text: question.text,
    categoryId: question.categoryId,
    answers: question.answers,
  });

  if (!createResult.ok) {
    return c.json({ message: 'error creating question' }, 500);
  }

  if (!createResult.value.created) {
    switch (createResult.value.reason) {
      case 'invalid-category':
        return c.json({ message: 'invalid category' }, 400);
      case 'invalid-answers':
        return c.json({ message: 'invalid answers' }, 400);
    }
  }

  return c.json(createResult.value.question, 201);
});

questionsApi.delete('/:id', async (c) => {
  const id = parseId(c.req.param('id'));

  if (!id) {
    return c.json({ message: 'invalid id' }, 400);
  }

  const question = await questionsClient.deleteQuestion(id);

  if (!question.ok) {
    return c.json({ message: 'error deleting question' }, 500);
  }

  if (!question.value) {
    return c.json({ message: 'question not found' }, 404);
  }

  return c.json({ message: 'question deleted' });
});

questionsApi.patch(
  '/:id',
  zValidator('json', QuestionCreateSchema),
  async (c) => {
    const id = parseId(c.req.param('id'));
    const question = c.req.valid('json');

    if (!id) {
      return c.json({ message: 'invalid id' }, 400);
    }

    const updateResult = await questionsClient.updateQuestion(id, {
      text: question.text,
      categoryId: question.categoryId,
      answers: question.answers,
    });

    if (!updateResult.ok) {
      return c.json({ message: 'error updating question' }, 500);
    }

    if (!updateResult.value) {
      return c.json({ message: 'question not found' }, 404);
    }

    return c.json(updateResult.value, 200);
  },
);
