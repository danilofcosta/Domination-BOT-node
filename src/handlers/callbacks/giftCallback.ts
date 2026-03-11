import { ChatType, type MyContext } from "../../utils/customTypes.js";
import { prisma } from "../../../lib/prisma.js";
import { language } from "../../../generated/prisma/enums.js";

export async function giftConfirmHandler(ctx: MyContext) {

  const [gifttype, action, giftid, revicerid, userid] = ctx.match
    ? (ctx.match as any).input.split("_")
    : [];

  console.log("ctx.match:", gifttype, action, giftid, userid);

  if (ctx.from?.id !== Number(userid)) {
    console.log(`id do usuário(${ctx.from?.id}) não corresponde ao userid (${userid}).`);
    console.log("Usuário não autorizado para esta ação.");
    ctx.answerCallbackQuery(ctx.t("error-action-not-autoauthorized-by-id "));
    return;
  }

  if (action === "no") {
    await ctx.deleteMessage().catch(console.error);
    return;
  }

  await prisma.$transaction(async (tx) => {

    // criar usuário caso não exista
    await tx.users.upsert({
      where: {
        telegram_id: Number(revicerid)
      },
      update: {},
      create: {
        preferred_language: language.PT,
        telegram_id: Number(revicerid),
        waifu_config:{} ,
        husbando_config: {},
        favorite_waifu_id: Number(giftid)
      }
    });

    // adicionar presente na coleção do receptor
    await tx.waifu_collection.create({
      data: {
        telegram_id: Number(revicerid),
        character_id: Number(giftid),
      }
    });

    // deletar presente da coleção do remetente
    const collectionItem = await tx.waifu_collection.findFirst({
      where: {
        telegram_id: Number(userid),
        character_id: Number(giftid),
      },
    });

    if (collectionItem) {
      await tx.waifu_collection.delete({
        where: { id: collectionItem.id },
      });
    }

  });

  await ctx.editMessageCaption({
    caption: ctx.t("gift_success"),
  }).catch(console.error);

}