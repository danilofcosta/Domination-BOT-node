import { prisma } from "../../../../lib/prisma.js";
import { type MyContext, ChatType } from "../../../utils/customTypes.js";
import { mentionUser } from "../../../utils/metion_user.js";
import { Sendmedia } from "../../../utils/sendmedia.js";

export async function topHander(ctx: MyContext) {

  // 1️⃣ pegar distinct user+character
  const unique = ctx.genero === ChatType.HUSBANDO ? await prisma.husbando_collection.findMany({
    distinct: ["telegram_id", "character_id"],
    select: {
      telegram_id: true
    }
  }): await prisma.waifu_collection.findMany({
    distinct: ["telegram_id", "character_id"],
    select: {
      telegram_id: true
    }
  });

  // 2️⃣ contar por usuário
  const map = new Map<number, number>();

  for (const item of unique) {
    const id = Number(item.telegram_id);
    map.set(id, (map.get(id) || 0) + 1);
  }

  // 3️⃣ ordenar top 10
  const ranking = [...map.entries()]
    .map(([telegram_id, total]) => ({ telegram_id, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // 4️⃣ pegar dados dos usuários
  const users = await prisma.users.findMany({
    where: {
      telegram_id: {
        in: ranking.map(r => BigInt(r.telegram_id))
      }
    },
    select: {
      telegram_id: true,
      telegram_user_data: true
    }
  });

  const userMap = new Map(
    users.map(u => [Number(u.telegram_id), u.telegram_user_data])
  );

  const header = ctx.t("top_header");
  const top_pre_index = ctx.t("top_pre_index");
  const top_header_start = ctx.t("top_header_start");
  const top_header_end = ctx.t("top_header_end");

  const top_users: string[] = [];

  ranking.forEach((item, index) => {
    const userData = userMap.get(item.telegram_id) as any ?? {};

    const name =
      userData.username ||
      userData.NAME ||
      userData.first_name ||
      "user";

    const mention = mentionUser(name, item.telegram_id);

    top_users.push(
      `${top_pre_index} ${index + 1}. ${mention} - ${item.total}`
    );
  });

  const top = `${header}\n\n ${top_header_start}\n${top_users.join("\n")}\n${top_header_end}\n`;
 const end_character = ctx.genero === ChatType.HUSBANDO ? await prisma.characters_husbando.findMany({
  take: 1,
  orderBy: {
    id: "desc",
  },
 }): await prisma.characters_waifu.findMany({
  take: 1,
  orderBy: {
    id: "desc",
  },
 }); 

 const character = end_character[0] || null;
 
 if (character) await Sendmedia(ctx, character, top);
}