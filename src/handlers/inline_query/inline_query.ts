import { Result } from "pg";
import { prisma } from "../../../lib/prisma.js";
import { ChatType, type MyContext } from "../../utils/customTypes.js";

import { showResults } from "./show_results_inline.js";
import { createResult } from "./create_inline_result.js";
const LIMIT = 25;
export async function getCharacters(ctx: MyContext) {
  if (!ctx.inlineQuery) return;
  const query = ctx.inlineQuery.query;

  const per =
    ctx.genero === ChatType.HUSBANDO
      ? await prisma.characters_husbando.findFirst({
          where: { id: Number(query) },
          include: { rarities: true, events: true },
        })
      : await prisma.characters_waifu.findFirst({
          where: { id: Number(query) },
          include: { rarities: true, events: true },
        });
  console.log("Result:", per);
  if (!per) return;
  const result = createResult({
    character: per,
    ctx,
    username: null,
    user_id: null,
    repetition: null,
  });

  console.log("Result:", result);

  await showResults({
    ctx: ctx,
    results: [result],
  });
}

export async function getCharactersall(ctx: MyContext) {
  // if (!ctx.inlineQuery) return;
  const offset = Number(ctx.inlineQuery?.offset) || 0;
  // buscar os personagens em ordem crescente de id, limitando a quantidade de resultados e pulando os já mostrados
  const pers =
    ctx.genero === ChatType.HUSBANDO
      ? await prisma.characters_husbando.findMany({
          include: { rarities: true, events: true },
          take: LIMIT,
          orderBy: {
            id: "desc",
          },
          skip: offset,
        })
      : await prisma.characters_waifu.findMany({
          take: LIMIT,
          include: { rarities: true, events: true },
          orderBy: {
            id: "desc",
          },
          skip: offset,
        });
  const total =
    ctx.genero === ChatType.HUSBANDO
      ? await prisma.characters_husbando.count()
      : await prisma.characters_waifu.count();

  if (!pers) return;

  // criar os resultados para cada personagem
  const results = pers.map((per) =>
    createResult({
      character: per,
      ctx,
      username: null,
      user_id: null,
      repetition: null,
    }),
  );
  // mostrar os resultados

  const next_offset =
    offset + LIMIT < total ? String(offset + LIMIT) : undefined;

  await showResults({
    ctx: ctx,
    results: results,
    next_offset: next_offset,
    text: `𝕯𝖔𝖒𝖎𝖓𝖆𝖙𝖎𝖔𝖓𝕾 : ${total}`,
  });
}
