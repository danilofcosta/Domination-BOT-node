import type {
  mediatype,
  eventtype,
  raritytype,
} from "../../../generated/prisma/enums.js";
import {
  Prisma,
  type characters_husbando,
  type characters_waifu,
  type events,
  type rarities,
} from "../../../generated/prisma/client.js";

import { prisma } from "../../../lib/prisma.js";
import { ChatType, type MyContext } from "../../utils/customTypes.js";
import { createResult } from "./create_inline_result.js";
import { showResults } from "./show_results_inline.js";
import { group } from "node:console";

const LIMIT = 5;

export type RawCharacter = {
  id: number;
  character_name: string;
  event_code: eventtype;
  rarity_code: raritytype;
  media_type: mediatype;
  data: string;
  origem: string;

  event_name: string;
  event_emoji: string | null;

  rarity_name: string;
  rarity_emoji: string | null;

  copies: number;
};

type CharacterWithRelations = (characters_husbando | characters_waifu) & {
  events: events;
  rarities: rarities;
};

export async function getGroupedCollection(
  ctx: MyContext,
  telegramId: number,
  offset: number = 0,
  limit: number = LIMIT,
): Promise<RawCharacter[]> {
  const isHusbando = ctx.genero === ChatType.HUSBANDO;

  const collectionTable = isHusbando
    ? Prisma.sql`husbando_collection`
    : Prisma.sql`waifu_collection`;

  const charactersTable = isHusbando
    ? Prisma.sql`characters_husbando`
    : Prisma.sql`characters_waifu`;

  const alias = isHusbando ? Prisma.sql`hc` : Prisma.sql`wc`;

  return prisma.$queryRaw<RawCharacter[]>(Prisma.sql`
    SELECT 
      c.id,
      c.character_name,
      c.event_code,
      c.rarity_code,
      c.media_type,
      c.data,
      c.origem,
      e.name as event_name,
      e.emoji as event_emoji,
      r.name as rarity_name,
      r.emoji as rarity_emoji,
      COUNT(${alias}.character_id)::int as copies
    FROM ${collectionTable} ${alias}
    JOIN ${charactersTable} c ON c.id = ${alias}.character_id
    JOIN events e ON e.code = c.event_code
    JOIN rarities r ON r.code = c.rarity_code
    WHERE ${alias}.telegram_id = ${telegramId}
    GROUP BY 
      c.id,
      c.character_name,
      c.event_code,
      c.rarity_code,
      c.media_type,
      c.data,
      c.origem,
      e.id,
      r.id
    ORDER BY c.id DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `);
}


// retorna os personagens do harem do telegram para iniline
export async function get_harem_collection(
  ctx: MyContext,
  telegramId: number,
  offset: number = 0,
  limit: number = LIMIT,
) {
  const coletiona =
    ctx.genero === ChatType.HUSBANDO
      ? await prisma.husbando_collection.findMany({
          take: limit,
          skip: offset,
          where: {
            telegram_id: telegramId,
          },
          distinct: ["character_id"],
          orderBy: {
            added_at: "desc",
          },
          include: {
            users: true,
            characters_husbando: { include: { rarities: true, events: true } },
          },
        })
      : await prisma.waifu_collection.findMany({
          take: limit,
          skip: offset,
          where: {
            telegram_id: telegramId,
          },
          distinct: ["character_id"],
          orderBy: {
            added_at: "desc",
          },
          include: {
            users: true,
            characters_waifu: {
              include: {
                rarities: true,
                events: true,
              },
            },
          },
        });

  return coletiona;
}

function mapToCharacter(item: RawCharacter): CharacterWithRelations {
  return {
    id: item.id,
    character_name: item.character_name,
    event_code: item.event_code,
    rarity_code: item.rarity_code,
    media_type: item.media_type,
    data: item.data,
    origem: item.origem,

    extras: null,
    created_at: new Date(),
    updated_at: new Date(),
    tipo_fonte: "",

    events: {
      id: 0,
      code: item.event_code,
      name: item.event_name,
      emoji: item.event_emoji,
      description: null,
    },

    rarities: {
      id: 0,
      code: item.rarity_code,
      name: item.rarity_name,
      emoji: item.rarity_emoji,
      description: null,
    },

    // propriedades obrigatórias para satisfazer o tipo union
    husbando_collection: [],
    waifu_collection: [],
    users: [],
  } as CharacterWithRelations;
}

export async function Harem_iniline_query(ctx: MyContext) {
  if (!ctx.inlineQuery) return;

  const query = ctx.inlineQuery.query;
  const userId = query.split("harem_user_")[1];
  if (!userId) return;

  const telegramId = Number(userId.trim());
  const offset = parseInt(ctx.inlineQuery.offset || "0", 10);

  const coletiton = await get_harem_collection(ctx, telegramId, offset);

  if (!coletiton.length) return;

  const results = coletiton.map((item) => {
    const character =
      ctx.genero === ChatType.HUSBANDO
        ? (item as any).characters_husbando
        : (item as any).characters_waifu;
    const userData =
      (item.users.telegram_user_data as Record<string, any>) || {};
    return createResult({
      character,
      ctx,
      username:
        userData.NAME ||
        userData.name ||
        userData.FIST_NAME ||
        userData.first_name ||
        "user",
      user_id: telegramId,
      repetition: (item as any).copies ?? null,
    });
  });

  await showResults({
    ctx,
    results,
    next_offset: (offset + LIMIT).toString(),
    text: `𝕯𝖔𝖒𝖎𝖓𝖆𝖙𝖎𝖔𝖓𝕾 : ${ctx.genero}`,
  });
}
