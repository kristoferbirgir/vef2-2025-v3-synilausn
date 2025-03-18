import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const categories = await prisma.category.createManyAndReturn({
    data: [
      { name: 'HTML', slug: 'html' },
      { name: 'CSS', slug: 'css' },
      { name: 'JavaScript', slug: 'javascript' },
    ],
  });

  console.log('Created categories:', categories.length);

  await prisma.question.create({
    data: {
      text: 'Ef við værum að smíða vefsíðu og myndum vilja geta farið frá index.html yfir á about.html, hvað væri best að nota?',
      answers: {
        create: [
          {
            text: '<a href="about.html">About</a>',
            correct: true,
          },
          {
            text: '<form method="get" action="about.html"><button>About</button></form>',
            correct: false,
          },
          {
            text: '<button to="about.html">About</button>',
            correct: false,
          },
          {
            text: 'Allar jafn góðar / All equally good',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[0].id,
        },
      },
    },
  });

  await prisma.question.create({
    data: {
      text: 'Í <head> á vefjum setjum við <meta charset="utf-8"> (eða það stafasett sem nota á), afhverju er það gert?',
      answers: {
        create: [
          {
            text: 'Þannig að stafir birtist rétt.',
            correct: true,
          },
          {
            text: 'Skilgreining sem visual studio verður að hafa þannig að prettier virki rétt.',
            correct: false,
          },
          {
            text: 'Skilgreining sem aXe krefur okkur um til að vefur verði aðgengilegur.',
            correct: false,
          },
          {
            text: 'Ekkert af þessu.',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[0].id,
        },
      },
    },
  });

  await prisma.question.create({
    data: {
      text: 'Það sem við getum gert til að forrita aðgengilega vefi er',
      answers: {
        create: [
          {
            text: 'Allt af þessu.',
            correct: true,
          },
          {
            text: 'Nota eingöngu lyklaborð við að skoða og nota vefinn.',
            correct: false,
          },
          {
            text: 'Merkja form á aðgengilegan hátt.',
            correct: false,
          },
          {
            text: 'Hafa tóman alt texta á myndum ef þær eru eingöngu til skrauts.',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[0].id,
        },
      },
    },
  });

  await prisma.question.create({
    data: {
      text: 'Hvað er merkingarfræði í sambandi við námsefnið?',
      answers: {
        create: [
          {
            text: 'Hvert HTML element hefur einhverja skilgreinda merkingu—merkingarfræðilegt gildi—sem við þurfum að hafa í huga þegar við smíðum vefi.',
            correct: true,
          },
          {
            text: 'Hvert HTML tag hefur einhverja skilgreinda merkingu—merkingarfræðilegt gildi—sem við þurfum að hafa í huga þegar við smíðum vefi.',
            correct: false,
          },
          {
            text: 'Hvert CSS eigindi hefur einhverja skilgreinda merkingu—merkingarfræðilegt gildi—sem við þurfum að hafa í huga þegar við smíðum vefi.',
            correct: false,
          },
          {
            text: 'Hver CSS selector hefur einhverja skilgreinda merkingu—merkingarfræðilegt gildi—sem við þurfum að hafa í huga þegar við smíðum vefi.',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[0].id,
        },
      },
    },
  });

  console.info('Created HTML questions');

  await prisma.question.create({
    data: {
      text: 'Fyrir eftirfarandi HTML / for the following HTML:\n\n\n<div class="text">\n  <h1 class="important text__title">Halló heimur</p>\n</div>\n \n\nEr skilgreint CSS / there is defined CSS:\n\n\n.text {\n  font-size: 10px;\n  color: green;\n}\n\n.text .text__title {\n  font-size: 1.5em;\n}\n\n.important {\n  font-size: 2em;\n  color: red;\n}\n\n \n\nHvert af eftirfarandi er satt fyrir textann „Halló heimur“ eftir að búið er að reikna gildi?',
      answers: {
        create: [
          {
            text: 'font-size: 20px;, color: green;',
            correct: true,
          },
          {
            text: 'font-size: 15px;, color: red;',
            correct: false,
          },
          {
            text: 'font-size: 20px;, color: red;',
            correct: false,
          },
          {
            text: 'font-size: 15px;, color: green;',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[1].id,
        },
      },
    },
  });

  await prisma.question.create({
    data: {
      text: 'Ef við erum að nota nýtt gildi fyrir lit í CSS sem er ekki víst að sé stutt í öllum vöfrum, þá ættum við að',
      answers: {
        create: [
          {
            text: 'Skilgreina fallback gildi á undan nýja gildinu sem væri notað í stað þess ef það er ekki stutt',
            correct: true,
          },
          {
            text: 'Skilgreina fallback gildi á eftir nýja gildinu sem væri notað í stað þess ef það er ekki stutt.',
            correct: false,
          },
          {
            text: 'Setja upp JavaScript virkni sem bendir notanda á að sækja nýjann vafra sem styður gildið.',
            correct: false,
          },
          {
            text: 'Þetta er ekki stutt í CSS.',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[1].id,
        },
      },
    },
  });

  await prisma.question.create({
    data: {
      text: 'Í verkefnum höfum við unnið með „containers“ og „items“ sem hugtök, hvað á það við?',
      answers: {
        create: [
          {
            text: '„Flex container“ og „flex items; „grid container“ og „grid items“: greinarmunur á foreldri og börnum þegar flexbox og CSS grid er notað.',
            correct: true,
          },
          {
            text: '„Flex container“ og „flex items: greinarmunur á foreldri og börnum eingngu þegar flexbox er notað.',
            correct: false,
          },
          {
            text: '„Grid container“ og „grid items“: greinarmunur á foreldri og börnum eingöngu þegar grid er notað.',
            correct: false,
          },
          {
            text: 'Hugtök sem eru notuð með `querySelectorAll`: „container“ er það element sem leitað er undir, „items“ það sem er skilað.',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[1].id,
        },
      },
    },
  });

  await prisma.question.create({
    data: {
      text: 'Þegar við notum flexbox hvað af eftirfarandi er satt? Gerið ráð fyrir að skjal sé lesið frá vinstri til hægri.',
      answers: {
        create: [
          {
            text: 'Höfum skilgreinda tvo ása: aðalás og krossás sem eru hornréttir; sjálfgefin röðun er á aðalás frá vinstri til hægri.',
            correct: true,
          },
          {
            text: 'Höfum skilgreinda tvo ása: aðalás og krossás sem eru samsíða; sjálfgefin röðun er á aðalás frá vinstri til hægri.',
            correct: false,
          },
          {
            text: 'Höfum skilgreinda tvo ása: aðalás og krossás sem eru hornréttir; sjálfgefin röðun er á krossás frá vinstri til hægri.',
            correct: false,
          },
          {
            text: 'Höfum skilgreinda tvo ása: aðalás og krossás sem eru samsíða; sjálfgefin röðun er á krossás frá vinstri til hægri.',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[1].id,
        },
      },
    },
  });

  console.info('Created CSS questions');

  await prisma.question.create({
    data: {
      text: 'Hvað er skrifað út eftir að eftirfarandi kóði er keyrður?\n\nconst items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\nconst іtem = items\n  .map((i) => i * 2)\n  .filter(\n    (i) => i < 10\n  )\n  .find((i) => i > 6)\n\n\nconsole.log(item);',
      answers: {
        create: [
          {
            text: '8',
            correct: true,
          },
          {
            text: '[8]',
            correct: false,
          },
          {
            text: 'Uncaught ReferenceError: item is not defined',
            correct: false,
          },
          {
            text: 'undefined',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[2].id,
        },
      },
    },
  });

  await prisma.question.create({
    data: {
      text: 'Þegar við berum saman gildi í JavaScript ættum við alltaf að nota þrjú samasem merki (`===`) því að',
      answers: {
        create: [
          {
            text: 'Þessi samanburður byrjar á að bera saman týpur gilda og kemst því framhjá type coercion sem gerist með samanburð með tveimur samasem merkjum.',
            correct: true,
          },
          {
            text: 'Við ættum alltaf að nota tvö samasem merki, ekki þrjú því þá byrjum við á að bera saman týpur gilda og komumst þannig framhjá type coercion.',
            correct: false,
          },
          {
            text: 'Þessi samanburður kemst framhjá truthy og falsy gildum og skilar eingöngu réttum niðurstöðum fyrir primitive gildi.',
            correct: false,
          },
          {
            text: 'Þessi samanburður nýtir lógíska virkja sem virka aðeins í tvístæðum.',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[2].id,
        },
      },
    },
  });

  await prisma.question.create({
    data: {
      text: 'Þegar við notum `fetch` í JavaScript ætti ferlið við að sækja gögn að vera',
      answers: {
        create: [
          {
            text: 'Búið til `fetch` request kall sem tilgreinir að minnsta kosti URL; villuathugun á kalli og svari með tilliti til HTTP; gögn sótt í response með villuathugun.',
            correct: true,
          },
          {
            text: 'Búið til `fetch` request kall sem verður að tilgreina URL, HTTP aðferð og stöðukóða; villuathugun á kalli og svari með tilliti til HTTP; gögn sótt í response með villuathugun.',
            correct: false,
          },
          {
            text: 'Búið til `fetch` request kall sem tilgreinir að minnsta kosti URL; villuathugun á kalli og svari með tilliti til URL; gögn sótt í response.',
            correct: false,
          },
          {
            text: 'Búið til `fetch` request kall sem tilgreinir að minnsta kosti URL; villuathugun á kalli og svari með tilliti til HTTP; eingöngu JSON gögn sótt í response með villuathugun.',
            correct: false,
          },
        ],
      },
      category: {
        connect: {
          id: categories[2].id,
        },
      },
    },
  });

  console.info('Created JavaScript questions');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
