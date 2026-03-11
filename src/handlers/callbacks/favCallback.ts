import { ChatType, type MyContext } from "../../utils/customTypes.js";
import { prisma } from "../../../lib/prisma.js";
export async function favConfirmHandler(ctx: MyContext) {
  console.log(ctx);
  const [favtype, action, favid, userid] = ctx.match
    ? (ctx.match as any).input.split("_")
    : [];
  console.log("ctx.match:", favtype, action, favid, userid);

  if (ctx.from?.id !== Number(userid)) {
    console.log("Usuário não autorizado para esta ação.");
    ctx.answerCallbackQuery(ctx.t("error-action-not-autoauthorized-by-id "));
    return;
  }
  if (action === "no") {
    ctx.deleteMessage().catch((err) => {
      console.error("Erro ao deletar mensagem:", err);
    });
    return;
  }
  const user = await prisma.users.update({
    where: { telegram_id: Number(userid) },
    data: {
      favorite_husbando_id:
        action === "yes" && ctx.genero === ChatType.WAIFU
          ? Number(favid)
          : (null as any),
      favorite_waifu_id:
        action === "yes" && ctx.genero === ChatType.HUSBANDO
          ? Number(favid)
          : (null as any),
    },
  });
  console.log("user:", user);
  await ctx.answerCallbackQuery({
    text: ctx.t("fav-character-success"),
  });

  // editar mensagem
  await ctx
    .editMessageCaption({
      caption: `personagem foi feito favorito !\n\nID: ${favid} - ${ctx.genero === ChatType.WAIFU ? "Waifu" : "Husbando"} use /harem para ver seu personagem favorito!`,
    })
    .catch(console.error);
}
