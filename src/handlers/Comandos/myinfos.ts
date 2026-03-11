import { prisma } from "../../../lib/prisma.js";
import { ChatType, type MyContext } from "../../utils/customTypes.js";

export async function Myinfos(ctx: MyContext) {
  console.log("myinfos");
  const loading = await ctx.reply(ctx.t("loading"));

  // Buscar o usuário
  const user = await prisma.users.findUnique({
    where: {
      telegram_id: ctx.from!.id,
    },
    include: {
      waifu_collection: ctx.genero === ChatType.WAIFU ? true : false,
      husbando_collection: ctx.genero === ChatType.HUSBANDO ? true : false,
    },
  });

  if (!user) {
    await ctx.api.deleteMessage(loading.chat.id, loading.message_id);
    return ctx.reply(ctx.t("error-not-registered"));
  }

  const totalDB = await prisma.characters_waifu.count();

  const totalUser =
    user.waifu_collection?.length || 0 + user.husbando_collection?.length || 0;
  const percent = totalDB > 0 ? ((totalUser / totalDB) * 100).toFixed(2) : "0";

  const maxBlocks = 10;
  const filled = Math.round((totalUser / totalDB) * maxBlocks);
  const bar = "▰".repeat(filled) + "▱".repeat(maxBlocks - filled);

  const text = [
    ctx.t("myinfo-title"),
    ctx.t("myinfo-user", { name: ctx.from!.first_name }),
    ctx.t("myinfo-id", { id: ctx.from!.id }),
    ctx.t("myinfo-total", { genero: ctx.genero, total: totalUser }),
    ctx.t("myinfo-harem", { userTotal: totalUser, dbTotal: totalDB, percent }),
    ctx.t("myinfo-progress", { bar }),
    ctx.t("myinfo-end"),
  ].join("\n");

  await ctx.api.deleteMessage(loading.chat.id, loading.message_id);

  return ctx.reply(text);
}
