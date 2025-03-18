import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono';

import { CategoriesDbClient } from '../lib/categories.db.js';
import { parseLimitOffset } from '../lib/limitOffset.js';
import { ConsoleLogger } from '../lib/logger.js';
import { validateSlug } from '../lib/slugs.js';
import { CategoryCreateSchema } from '../schema.zod.js';

export const categoriesApi = new Hono();

const logger = new ConsoleLogger();
const categoriesClient = new CategoriesDbClient(new PrismaClient(), logger);

categoriesApi.get('/', async (c) => {
  const limitOffset = parseLimitOffset(
    c.req.query('limit'),
    c.req.query('offset'),
  );

  if (!limitOffset) {
    return c.json({ message: 'invalid limit or offset' }, 400);
  }

  const categories = await categoriesClient.getCategories(limitOffset);

  if (!categories.ok) {
    return c.json({ message: 'error fetching categories' }, 500);
  }

  return c.json(categories.value);
});

categoriesApi.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  if (!validateSlug(slug)) {
    return c.json({ message: 'invalid slug' }, 400);
  }

  const category = await categoriesClient.getCategoryBySlug(slug);

  if (!category.ok) {
    return c.json({ message: 'error fetching category' }, 500);
  }

  if (!category.value) {
    return c.json({ message: 'category not found' }, 404);
  }

  return c.json(category.value);
});

categoriesApi.post('/', zValidator('json', CategoryCreateSchema), async (c) => {
  const category = c.req.valid('json');

  const createResult = await categoriesClient.createCategory({
    name: category.name,
  });

  if (!createResult.ok) {
    return c.json({ message: 'error creating category' }, 500);
  }

  if (!createResult.value.created) {
    switch (createResult.value.reason) {
      case 'invalid-slug':
        return c.json({ message: 'invalid slug' }, 400);
      case 'exists':
        return c.json(createResult.value.category, 200);
    }
  }

  return c.json(createResult.value.category, 201);
});

categoriesApi.patch(
  '/:slug',
  zValidator('json', CategoryCreateSchema),
  async (c) => {
    const slug = c.req.param('slug');
    const category = c.req.valid('json');

    if (!validateSlug(slug)) {
      return c.json({ message: 'invalid slug' }, 400);
    }

    const updateResult = await categoriesClient.updateCategory(slug, {
      name: category.name,
    });

    if (!updateResult.ok) {
      return c.json({ message: 'error creating category' }, 500);
    }

    return c.json(updateResult.value, 200);
  },
);

categoriesApi.delete('/:slug', async (c) => {
  const slug = c.req.param('slug');

  if (!validateSlug(slug)) {
    return c.json({ message: 'invalid slug' }, 400);
  }

  const deleteResult = await categoriesClient.deleteCategory(slug);

  if (!deleteResult.ok) {
    return c.json({ message: 'error deleting category' }, 500);
  }

  if (!deleteResult.value) {
    return c.json({ message: 'category not found' }, 404);
  }

  return c.body(null, 204);
});
