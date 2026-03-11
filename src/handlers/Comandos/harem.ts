import { InlineKeyboard } from "grammy";
import { prisma } from "../../../lib/prisma.js";
import { ChatType, type MyContext } from "../../utils/customTypes.js";
import { Sendmedia } from "../../utils/sendmedia.js";
import {
  getGroupedCollection,
  type RawCharacter,
} from "../inline_query/harem_inline_query.js";
import { setHarem } from "../../cache/cache.js";
import { mentionUser } from "../../utils/metion_user.js";

export async function HaremHandler(ctx: MyContext) {
  const user = await prisma.users.findUnique({
    where: {
      telegram_id: Number(ctx.from?.id),
    },
    include: {
      characters_husbando: {
        include: {
          events: true,
          rarities: true,
        },
      },
      characters_waifu: {
        include: {
          events: true,
          rarities: true,
        },
      },
    },
  });

  if (!user) {
    ctx.reply(ctx.t("harem_no_user"));
    return;
  }

  const data = await getGroupedCollection(
    ctx,
    Number(ctx.from?.id),
    
    undefined,
    undefined,
  );

  // console.log(user);
  const pages = Harem_mode_default(data);

  setHarem(Number(ctx.from?.id), pages);
  const harem_logo = ctx.t("harem_logo", {
    usermention: mentionUser(`<b>${ctx.from?.first_name}</b>`|| "user", ctx.from?.id || 0) || "User",
  });
  const userId = ctx.from?.id;
  const character =
    ctx.genero === ChatType.HUSBANDO
      ? user.characters_husbando
      : user.characters_waifu;
      // console.log(character);

  const reply_markup = new InlineKeyboard()
    .text(ctx.t("harem_btn_prev_page"), `harem_user_${userId}_prev`)
    .text(ctx.t("harem_btn_current_page", { currentpage: 1, totalpages: pages.length||1 }), `harem_user_${userId}_page`)
    .text(ctx.t("harem_btn_next_page"), `harem_user_${userId}_next_${pages.length>1?1:0}`)
    .row()
    // .switchInline(ctx.t("harem_btn_inline_query"), `harem_user_${userId}`)
     .switchInlineCurrent(ctx.t("harem_btn_inline_query"), `harem_user_${userId}`)
    .text(ctx.t("harem_btn_fast_page"), `harem_user_${userId}_jump`)
    .row()
    .text(ctx.t("harem_btn_close"), `harem_user_${userId}_close`);
  await Sendmedia(ctx, character, harem_logo + "\n\n" + pages[0], reply_markup);

}

type GroupedByOrigem = Record<string, RawCharacter[]>;

export function groupByOrigem(characters: RawCharacter[]): GroupedByOrigem {
  return characters.reduce<GroupedByOrigem>((acc, char) => {
    const origem = char.origem ?? "unknown";

    if (!acc[origem]) {
      acc[origem] = [];
    }

    acc[origem].push(char);

    return acc;
  }, {});
}function Harem_mode_default(list: RawCharacter[]) {
  const grouped = groupByOrigem(list);

  const MAX_CAPTION = 900; // limite seguro para caption de foto/video
  const separator = "✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧";

  const pages: string[] = [];
  let page = "";

  for (const [origem, characters] of Object.entries(grouped)) {
    const header =
      `☛ ${origem.charAt(0).toUpperCase() + origem.slice(1)} (${characters.length})\n` +
      `${separator}\n`;

    if (page.length + header.length > MAX_CAPTION) {
      pages.push(page);
      page = "";
    }

    page += header;

    for (const char of characters) {
      const copies = Number(char.copies);

      const eventEmoji =
        char.event_code !== "NONE" ? ` ${char.event_emoji}` : "";

      const line =
        `➢ ꙳ ${char.id} ꙳ ${char.rarity_emoji} ꙳ ${char.character_name}${eventEmoji} ${copies}x\n`;

      if (page.length + line.length > MAX_CAPTION) {
        page += `${separator}\n`;
        pages.push(page);
        page = header;
      }

      page += line;
    }

    page += `${separator}\n\n`;
  }

  if (page.length > 0) {
    pages.push(page);
  }

  return pages;
}