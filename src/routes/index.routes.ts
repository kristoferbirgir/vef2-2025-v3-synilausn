import { Hono } from 'hono';
import { categoriesApi } from './categories.routes.js';
import { questionsApi } from './questions.routes.js';

export const api = new Hono();

const routes = [
  {
    href: '/',
    methods: ['GET'],
  },
  {
    href: '/categories',
    querystrings: ['limit', 'offset'],
    methods: ['GET', 'POST'],
  },
  {
    href: '/categories/:slug',
    methods: ['GET', 'PATCH', 'DELETE'],
  },
  {
    href: '/questions',
    methods: ['GET', 'POST'],
  },
  {
    href: '/questions/:id',
    methods: ['GET', 'PATCH', 'DELETE'],
  },
];

api.get('/', (c) => c.json(routes));
api.route('/categories', categoriesApi);
api.route('/questions', questionsApi);
