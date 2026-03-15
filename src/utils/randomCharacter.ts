// src/utils/randomCharacter.ts
import { ChatType, type MyContext } from "./customTypes.js";
import { prisma } from "../../lib/prisma.js";
import type {
  characters_husbando,
  characters_waifu,
} from "../../generated/prisma/client.js";

export async function RandomCharacter(
  ctx: MyContext,
): Promise<characters_husbando | characters_waifu | null> {
 
  async function getRandom<T>(table: any): Promise<T | null> {
    const total = await table.count();
    if (total === 0) return null;

    const randomIndex = Math.floor(Math.random() * total);
    const [item] = await table.findMany({ skip: randomIndex, take: 1,include: { rarities: true, events: true } });
    return item as T;
  }

  if (ctx.genero === ChatType.HUSBANDO) {
    return await getRandom<characters_husbando>(prisma.characters_husbando);
  } else {
    return await getRandom<characters_waifu>(prisma.characters_waifu);
  }
}
