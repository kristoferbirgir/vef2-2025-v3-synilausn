import type { PrismaClient } from '@prisma/client';
import type {
  Id,
  IQuestions,
  LimitOffset,
  Paginated,
  Question,
  QuestionCreateResult,
  QuestionToCreate,
  Result,
} from '../types.js';
import type { ILogger } from './logger.js';

export class QuestionsDbClient implements IQuestions {
  private prisma: PrismaClient;
  private logger: ILogger;

  constructor(prisma: PrismaClient, logger: ILogger) {
    this.prisma = prisma;
    this.logger = logger;
  }

  async getQuestions(
    limitOffset: LimitOffset,
    categorySlug?: string,
  ): Promise<Result<Paginated<Question>>> {
    console.log('categorySlug :>> ', categorySlug);
    let questions;
    try {
      questions = await this.prisma.question.findMany({
        take: limitOffset.limit,
        skip: limitOffset.offset,
        include: {
          answers: true,
          category: true,
        },
        where: {
          category: {
            slug: categorySlug,
          },
        },
      });
    } catch (error) {
      this.logger.error('error fetching questions', limitOffset, error);
      return { ok: false, error: error as Error };
    }

    let totalQuestions;
    try {
      totalQuestions = await this.prisma.question.count({
        where: {
          category: {
            slug: categorySlug,
          },
        },
      });
    } catch (error) {
      this.logger.error('error counting questions', error);
      return { ok: false, error: error as Error };
    }

    const paginated: Paginated<Question> = {
      data: questions,
      total: totalQuestions,
      limit: limitOffset.limit,
      offset: limitOffset.offset,
    };

    return { ok: true, value: paginated };
  }

  async getQuestionById(id: Id): Promise<Result<Question | null>> {
    let question;
    try {
      question = await this.prisma.question.findFirst({
        where: {
          id,
        },
        include: {
          answers: true,
          category: true,
        },
      });
    } catch (error) {
      this.logger.error('error fetching question', id, error);
      return { ok: false, error: error as Error };
    }

    return { ok: true, value: question };
  }

  async createQuestion(
    question: QuestionToCreate,
  ): Promise<Result<QuestionCreateResult>> {
    let savedQuestion;
    try {
      savedQuestion = await this.prisma.question.create({
        data: {
          text: question.text,
          categoryId: question.categoryId,
          answers: {
            create: question.answers,
          },
        },
        include: {
          answers: true,
          category: true,
        },
      });
    } catch (error) {
      this.logger.error('error creating question', question, error);
      return { ok: false, error: error as Error };
    }

    return {
      ok: true,
      value: {
        created: true,
        question: savedQuestion,
      },
    };
  }

  async updateQuestion(
    id: Id,
    question: QuestionToCreate,
  ): Promise<Result<Question | null>> {
    let updatedQuestion;
    try {
      updatedQuestion = await this.prisma.question.update({
        where: {
          id,
        },
        data: {
          text: question.text,
          categoryId: question.categoryId,
          answers: {
            create: question.answers,
          },
        },
        include: {
          answers: true,
          category: true,
        },
      });
    } catch (error) {
      this.logger.error('error updating question', id, question, error);
      return { ok: false, error: error as Error };
    }

    return { ok: true, value: updatedQuestion };
  }

  async deleteQuestion(id: Id): Promise<Result<boolean | null>> {
    let questionExists;
    try {
      questionExists = await this.prisma.question.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error('error checking for existing question', id, error);
      return { ok: false, error: error as Error };
    }

    if (!questionExists) {
      return { ok: true, value: false };
    }

    try {
      await this.prisma.answer.deleteMany({
        where: {
          questionId: id,
        },
      });
    } catch (error) {
      this.logger.error('error deleting answers', id, error);
      return { ok: false, error: error as Error };
    }

    try {
      await this.prisma.question.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error('error deleting question', id, error);
      return { ok: false, error: error as Error };
    }

    return { ok: true, value: true };
  }
}
