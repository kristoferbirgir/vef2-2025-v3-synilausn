# Vefforritun 2 2025, verkefni 3 sýnilausn

Lausn á verkefni 3 í vefforritun 2 2025.

## Uppsetning

Til að keyra verkefnið þarf að setja upp `.env` skrá með:

- `DATABASE_URL` sem er tengistrengur fyrir PostgreSQL gagnagrunn
- `STATIC_DATA=true` ef nota á „static“ gögn

Keyrsla:

```bash
npm install
npx prisma db push
npx prisma db seed

# til að endursetja gagnagrunn
npx prisma db push --force-reset
npx prisma db seed
```

## Postman

Hægt er að setja inn `vef2-2025-v3.postman_collection.json` í Postman til að prófa vefþjónustuna.

## Uppskipting

1. Hono sér um vefþjónustulagið
2. Hjálparföll sjá um að staðfesta gögn
3. Interface og types notuð til að útfæra _hvernig_ gögnum er skaffað fyrir vefþjónustu
4. Prisma notað til að sækja gögn úr gagnagrunni
5. „Static“ gögn líka möguleiki

### Vefþjónustulag

Við höldum vefþjónustulagi eins smáu og einföldu og við getum, eiginlega bara að sækja gögn úr þjónustu og útfrá svari að velja rétta HTTP stöðu ásamt því sem við skilum.

Höldum okkur við það að þjónustulagið skili gögnum með viðeigandi stöðum og kasti aldrei villum.

### Staðfesting á gögnum

Zod notað til að staðfesta gögn, bæði sérstaklega fyrir hjálparföll og með Hono–Zod tengingu.

### Interface og types

Búum til interface og types fyrir það sem fer á milli vefþjónustulags og rest af forriti, sjá `src/types.ts`.

Þó svo að við fórum yfir að nota `z.infer` í fyrirlestri þá notar þessi lausn aðra aðferði: allar týpur eru skilgreindar óháð öðru og síðan notaðar. Það gerir útfærslu alveg óháða því hvernig gögn eru skilgreind. Til að tryggja að týpur séu réttar á móti Zod er `satisfies` notað.

Fyrir samskipti sem geta skilað villu er skilgreint almenn `Result` týpa sem getur annaðhvort verið að samskipti gengu og við fáum gögn eða að samskipti gengu ekki og við fáum villu. Með því getum við gert greinarmun á t.d. að eitthvað hafi farið úrskeiðis við að sækja gögn eða að gögn séu ekki til:

```ts
const result: Result<string | null> = getResult(slug);

if (result.ok) {
  // samskipti gengu

  if (result.data === null) {
    // gögn eru ekki til
  } else {
    // gögn eru til
  }
} else {
  // samskipti gengu ekki, eitthvað fór úrskeiðis
  console.error(result.error);
}
```

### Gögn

Með því að skilgreina interface sem skilar gögnum er hægt að búa til tvær (eða fleiri) útgáfur af gögnum, t.d. úr gagnagrunni og „static“.

Static gögn eru einfaldlega harðkóðuð gögn sem er skilað, sjá `src/lib/categories.static.ts` og `src/lib/questions.static.ts`.

## Prófanir á vefþjónustum

cURL til að prófa vefþjónustur fylgja með dæmum um kall og svar (búið að fjarlægja suma headers). Gerir ráð fyrir að byrja með tóman gagnagrunn.

### Flokkar

Sækja alla flokka:

```bash
> curl -i http://localhost:3000/categories

HTTP/1.1 200 OK
content-type: application/json
content-length: 43

{"data":[],"total":0,"limit":10,"offset":0}
```

Búa til flokk:

```bash
> curl -i -X POST http://localhost:3000/categories -H "Content-Type: application/json" -d '{"name": "Aðgengi vefforrita"}'

HTTP/1.1 201 Created
content-type: application/json
content-length: 64

{"id":1,"slug":"agengi-vefforrita","name":"Aðgengi vefforrita"}
```

Sækja flokkinn:

```bash
> curl -i http://localhost:3000/categories/agengi-vefforrita

HTTP/1.1 200 OK
content-type: application/json
content-length: 64

{"id":1,"slug":"agengi-vefforrita","name":"Aðgengi vefforrita"}
```

Uppfæra flokkinn:

```bash
> curl -i -X PATCH http://localhost:3000/categories/agengi-vefforrita -H "Content-Type: application/json" -d '{"name": "Aðgengi"}'

HTTP/1.1 200 OK
content-type: application/json
content-length: 42

{"id":1,"slug":"agengi","name":"Aðgengi"}%
```

Eyða flokknum:

```bash
> curl -i -X DELETE http://localhost:3000/categories/agengi

HTTP/1.1 204 No Content
```

## Test

Test skrifuð með vitest. Til að keyra test:

```bash
npm test
npm run test:watch # keyra test í watch mode
npm run test:coverage # keyra test með coverage í watch mode
```
