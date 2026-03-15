import { prisma } from "../../../../lib/prisma.js";
import { bts_yes_or_no } from "../../../utils/bts.js";
import { ChatType, type MyContext } from "../../../utils/customTypes.js";
import { mentionUser } from "../../../utils/metion_user.js";
import { Sendmedia } from "../../../utils/sendmedia.js";

// base comando gift @usuario personagem
export async function giftHandler(ctx: MyContext) {
  let giftid: number | undefined = undefined;
  let gift_receiver_id_user: number | undefined = undefined;
  let metion_receiver_gift: string | undefined = undefined;

  // let usementionedUserrrid  : number| undefined= undefined;
  console.log(ctx);

  if (ctx.message?.reply_to_message) {
    const repliedMessage = ctx.message.reply_to_message;
    const mentionedUser = repliedMessage.from;
    giftid = Number(ctx.match);
    gift_receiver_id_user = mentionedUser?.id;
    metion_receiver_gift = mentionUser(mentionedUser?.first_name || "", gift_receiver_id_user||0);
  }
  if (!ctx.message?.reply_to_message) {
    ctx.reply(ctx.t("gift_reply_instruction"));
    return;
  }

  if (!giftid || isNaN(giftid)) {
    ctx.reply(ctx.t("error-not-id"));
    return;
  }

  // busca de presente na coleção do usuário
  const GiftCharacter =
    ctx.genero === ChatType.WAIFU
      ? await prisma.waifu_collection.findFirst({
          where: {
            character_id: giftid,
            telegram_id: ctx.from!.id,
          },
          include: {
            characters_waifu: true,
          },
        })
      : await prisma.husbando_collection.findFirst({
          where: {
            character_id: giftid,
            telegram_id: ctx.from!.id,
          },
          include: {
            characters_husbando: true,
          },
        });

  if (!GiftCharacter) {
    return ctx.reply(
      ctx.t("fav-not-found", { genero: ctx.genero.toLocaleLowerCase() }),
    );
  }
  const characterData =
    "characters_waifu" in GiftCharacter
      ? GiftCharacter.characters_waifu
      : GiftCharacter.characters_husbando;

  // gerando texto de confirmação usando i18n
  const text = ctx.t("gift_confirmation_message", {
    username: !(metion_receiver_gift) ? "usuário" : metion_receiver_gift || "usuário",
    character_name: characterData.character_name || "",
    character_anime: characterData.origem || "",
  });

  const reply_markup = bts_yes_or_no(
    ctx,
    `gift_yes_${giftid}_${gift_receiver_id_user || "unknown"}_${ctx.from?.id}`,
    `gift_no_${giftid}_${gift_receiver_id_user || "unknown"}_${ctx.from?.id}`,
  );

  // pedido de confimação do presente
  return await Sendmedia(ctx, characterData, text, reply_markup);
  // const confirmationMessage = ctx.t("gift_confirmation_message", {
  //   user: !(mentionedUser?.first_name) ? "usuário" : mentionedUser?.first_name|| "usuário",
  // });
}
