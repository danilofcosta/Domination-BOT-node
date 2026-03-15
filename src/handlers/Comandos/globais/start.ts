import type { JsonValue } from "@prisma/client/runtime/client";
import type {
  eventtype,
  raritytype,
  mediatype,
} from "../../../../generated/prisma/enums.js";
import type { MyContext } from "../../../utils/customTypes.js";
import { RandomCharacter } from "../../../utils/randomCharacter.js";
import { Sendmedia } from "../../../utils/sendmedia.js";
import { InlineKeyboard } from "grammy";

export async function start(ctx: MyContext) {
  ctx.react("⚡" ,) ;
  const header = ctx.t("start-greeting-header", { botname: ctx.me.first_name });
  const boby = ctx.t("start-greeting-body", { genero: ctx.genero });
  const extra_body = ctx.t("start-greeting-extra-body"); //boby

  const greeting = ` ${header}\n\n <blockquote>${boby}\n\n${extra_body} </blockquote>`;

  const character = await RandomCharacter(ctx);
  if (!character) return ctx.reply(greeting);

  const replaymarkup = new InlineKeyboard()
    .url(
      ctx.t("start-btn-add"),
      `https://t.me/${ctx.me.username}?startgroup=true`,
    )
    .row()
    .text(ctx.t("start-btn-help"), `help_${ctx.from?.id}`).url(
      ctx.t("start-btn-database"),
   "https://t.me/Domination_Database",
    );

  await Sendmedia(ctx, character, greeting, replaymarkup);
}
