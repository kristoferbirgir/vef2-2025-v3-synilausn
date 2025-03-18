import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { api } from './routes/index.routes.js';

const PORT = process.env.PORT ?? '3000';
const port = Number.parseInt(PORT, 10);

const app = new Hono();
app.use(logger());
app.use(prettyJSON());
app.use('/*', cors({ origin: '*' }));
app.notFound((c) => c.json({ message: 'not found' }, 404));

app.onError((err, c) => {
  console.error(err.name, err.message);

  if (err.message === 'Malformed JSON in request body') {
    return c.json({ message: 'invalid json' }, 400);
  }

  return c.json({ message: 'internal server error' }, 500);
});

app.route('/', api);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`);
  },
);
