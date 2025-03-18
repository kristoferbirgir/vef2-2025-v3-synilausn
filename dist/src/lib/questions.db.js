export class QuestionsDbClient {
    prisma;
    logger;
    constructor(prisma, logger) {
        this.prisma = prisma;
        this.logger = logger;
    }
    async getQuestions(limitOffset, categorySlug) {
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
        }
        catch (error) {
            this.logger.error('error fetching questions', limitOffset, error);
            return { ok: false, error: error };
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
        }
        catch (error) {
            this.logger.error('error counting questions', error);
            return { ok: false, error: error };
        }
        const paginated = {
            data: questions,
            total: totalQuestions,
            limit: limitOffset.limit,
            offset: limitOffset.offset,
        };
        return { ok: true, value: paginated };
    }
    async getQuestionById(id) {
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
        }
        catch (error) {
            this.logger.error('error fetching question', id, error);
            return { ok: false, error: error };
        }
        return { ok: true, value: question };
    }
    async createQuestion(question) {
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
        }
        catch (error) {
            this.logger.error('error creating question', question, error);
            return { ok: false, error: error };
        }
        return {
            ok: true,
            value: {
                created: true,
                question: savedQuestion,
            },
        };
    }
    async updateQuestion(id, question) {
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
        }
        catch (error) {
            this.logger.error('error updating question', id, question, error);
            return { ok: false, error: error };
        }
        return { ok: true, value: updatedQuestion };
    }
    async deleteQuestion(id) {
        let questionExists;
        try {
            questionExists = await this.prisma.question.findFirst({
                where: {
                    id,
                },
            });
        }
        catch (error) {
            this.logger.error('error checking for existing question', id, error);
            return { ok: false, error: error };
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
        }
        catch (error) {
            this.logger.error('error deleting answers', id, error);
            return { ok: false, error: error };
        }
        try {
            await this.prisma.question.delete({
                where: {
                    id,
                },
            });
        }
        catch (error) {
            this.logger.error('error deleting question', id, error);
            return { ok: false, error: error };
        }
        return { ok: true, value: true };
    }
}
