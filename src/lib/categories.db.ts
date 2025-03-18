import type { PrismaClient } from '@prisma/client';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../constants.js';
import type {
  Category,
  CategoryCreateResult,
  CategoryToCreate,
  ICategory,
  LimitOffset,
  Paginated,
  Result,
  Slug,
} from '../types.js';
import type { ILogger } from './logger.js';
import { slugify } from './slugs.js';

export class CategoriesDbClient implements ICategory {
  private prisma: PrismaClient;
  private logger: ILogger;

  constructor(prisma: PrismaClient, logger: ILogger) {
    this.prisma = prisma;
    this.logger = logger;
  }

  async getCategories(
    limitOffset: LimitOffset = { limit: LIMIT_DEFAULT, offset: OFFSET_DEFAULT },
  ): Promise<Result<Paginated<Category>>> {
    let categories;
    try {
      categories = await this.prisma.category.findMany({
        take: limitOffset.limit,
        skip: limitOffset.offset,
      });
    } catch (error) {
      this.logger.error('error fetching categories', limitOffset, error);
      return { ok: false, error: error as Error };
    }

    let totalCategories;
    try {
      totalCategories = await this.prisma.category.count();
    } catch (error) {
      this.logger.error('error counting categories', error);
      return { ok: false, error: error as Error };
    }

    const paginated: Paginated<Category> = {
      data: categories,
      total: totalCategories,
      limit: limitOffset.limit,
      offset: limitOffset.offset,
    };

    return { ok: true, value: paginated };
  }

  async getCategoryBySlug(slug: Slug): Promise<Result<Category | null>> {
    let category;
    try {
      category = await this.prisma.category.findFirst({
        where: {
          slug,
        },
      });
    } catch (error) {
      this.logger.error('error fetching category', slug, error);
      return { ok: false, error: error as Error };
    }

    return { ok: true, value: category };
  }

  async createCategory(
    category: CategoryToCreate,
  ): Promise<Result<CategoryCreateResult>> {
    let categoryExists;
    try {
      // make sure we are not breaking the unique constraint
      categoryExists = await this.prisma.category.findFirst({
        where: {
          name: category.name,
        },
      });
    } catch (error) {
      this.logger.error(
        'error checking for existing category',
        category,
        error,
      );
      return { ok: false, error: error as Error };
    }

    // If the category already exists, we return it along with a specific reason
    // so the caller can decide what to do with it. This is not as elegant as
    // doing this all in a single validation, but here we are.
    if (categoryExists) {
      const result: CategoryCreateResult = {
        created: false,
        category: categoryExists,
        reason: 'exists',
      };
      return { ok: true, value: result };
    }

    const slug = slugify(category.name);

    // Here we run into a problem, if we have a slug that is not valid
    // how should we treat that?
    // E.g. we say "x  " is a valid category name, but it will be slugified
    // to "x" which is too short. Even if we fix that issue we'd still have
    // the potential for slugs to collide.
    // We've separated the slugify logic from the
    // validation (in the route) and now we need to handle it here.
    // This creates an inconsistency in our structure that maybe we should
    // address in a different way. But, for now, let's just return an error and
    // piggyback on the error handling we created for an existing category.
    if (!slug) {
      const result: CategoryCreateResult = {
        created: false,
        reason: 'invalid-slug',
      };
      this.logger.error('invalid slug', category);
      return { ok: true, value: result };
    }

    let savedCategory;
    try {
      // TODO this will fail on a slug collision which is something we should
      // handle but it should take into all above as well.
      savedCategory = await this.prisma.category.create({
        data: {
          name: category.name,
          slug,
        },
      });
    } catch (error) {
      this.logger.error('error creating category', category, error);
      return { ok: false, error: error as Error };
    }

    const result: CategoryCreateResult = {
      created: true,
      category: savedCategory,
    };
    return { ok: true, value: result };
  }

  async updateCategory(
    slug: Slug,
    category: CategoryToCreate,
  ): Promise<Result<Category | null>> {
    // TODO given the issues in createCategory, we just do the simples thing
    // here and return null on any error.
    // We should fix together with the above.
    let categoryExists;
    try {
      categoryExists = await this.prisma.category.findFirst({
        where: {
          slug,
        },
      });
    } catch (error) {
      this.logger.error('error checking for existing category', slug, error);
      return { ok: false, error: error as Error };
    }

    if (!categoryExists) {
      return { ok: true, value: null };
    }

    const newSlug = slugify(category.name);

    if (!newSlug) {
      // TODO we should handle this better! Pretty wild
      return { ok: false, error: new Error('invalid slug') };
    }

    let updatedCategory;
    try {
      updatedCategory = await this.prisma.category.update({
        where: {
          slug,
        },
        data: {
          name: category.name,
          slug: newSlug,
        },
      });
    } catch (error) {
      this.logger.error('error updating category', slug, category);
      return { ok: false, error: error as Error };
    }

    return { ok: true, value: updatedCategory };
  }

  async deleteCategory(slug: Slug): Promise<Result<boolean>> {
    let categoryExists;

    try {
      categoryExists = await this.prisma.category.findFirst({
        where: {
          slug,
        },
      });
    } catch (error) {
      this.logger.error('error checking for existing category', slug, error);
      return { ok: false, error: error as Error };
    }

    if (!categoryExists) {
      return { ok: true, value: false };
    }

    try {
      await this.prisma.category.delete({
        where: {
          slug,
        },
      });
    } catch (error) {
      this.logger.error('error deleting category', slug, error);
      return { ok: false, error: error as Error };
    }

    return { ok: true, value: true };
  }
}
