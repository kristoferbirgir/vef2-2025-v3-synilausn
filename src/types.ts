/**
 * Result type. Wraps a call result with either an Ok value or an Error.
 * If the call was successful, `ok` is true and `value` contains the result.
 * If the call failed, `ok` is false and `error` contains the error.
 * Default error type is `Error`.
 */
export type Result<Ok, Err = Error> =
  | { ok: true; value: Ok }
  | { ok: false; error: Err };

export type Paginated<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};

// TODO should we expose IDs?

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type CategoryToCreate = {
  name: string;
};

export type CategoryCreateResult =
  | {
      created: true;
      category: Category;
    }
  | {
      created: false;
      category: Category;
      reason: 'exists';
    }
  | {
      created: false;
      reason: 'invalid-slug';
    };

export type Answer = {
  id: number;
  text: string;
  correct: boolean;
};

export type Question = {
  id: number;
  text: string;
  answers: Answer[];
  category: Category;
};

export type AnswerToCreate = {
  text: string;
  correct: boolean;
};

export type QuestionToCreate = {
  text: string;
  categoryId: number;
  answers: AnswerToCreate[];
};

export type QuestionCreateResult =
  | {
      created: true;
      question: Question;
    }
  | {
      created: false;
      reason: 'invalid-category' | 'invalid-answers';
    };

export type LimitOffset = {
  limit: number;
  offset: number;
};

/** Explicit type for a slug, see how we use it with type guards in slug.ts */
export type Slug = string & { __brand: 'slug' };

/** Id is a positive integer. */
export type Id = number & { __brand: 'id' };

export interface ICategory {
  getCategories(limitOffset: LimitOffset): Promise<Result<Paginated<Category>>>;
  getCategoryBySlug(slug: Slug): Promise<Result<Category | null>>;
  createCategory(
    category: CategoryToCreate,
  ): Promise<Result<CategoryCreateResult>>;
  updateCategory(
    slug: Slug,
    category: CategoryToCreate,
  ): Promise<Result<Category | null>>;
  deleteCategory(slug: Slug): Promise<Result<boolean | null>>;
}

export interface IQuestions {
  getQuestions(
    limitOffset: LimitOffset,
    categorySlug?: string,
  ): Promise<Result<Paginated<Question>>>;
  getQuestionById(id: Id): Promise<Result<Question | null>>;
  createQuestion(
    question: QuestionToCreate,
  ): Promise<Result<QuestionCreateResult>>;
  updateQuestion(
    id: Id,
    question: QuestionToCreate,
  ): Promise<Result<Question | null>>;
  deleteQuestion(id: Id): Promise<Result<boolean | null>>;
}
