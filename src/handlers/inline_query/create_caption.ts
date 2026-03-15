import type {
  characters_husbando,
  characters_waifu,
  events,
  rarities,
} from "../../../generated/prisma/client.js";
import { eventtype } from "../../../generated/prisma/client.js";
import { ChatType, type MyContext } from "../../utils/customTypes.js";
import { mentionUser } from "../../utils/metion_user.js";
import type { Params } from "./create_inline_result.js";

export function create_caption({
  character,
  ctx,
  username,
  user_id,
  repetition,
}: Params) {
  const genero = ctx.genero === ChatType.WAIFU ? "essa waifu" : "esse husbando";

  const usermention =
    username && user_id ? mentionUser(username ?? "user", Number(user_id)) : "";

  const char = character as any;
  const emoji_event =
    char.events?.code === eventtype.NONE ? "" : char.events?.emoji;

  const title = ctx.t("harem_inline_caption_title", {
    genero: genero ?? "",
    usermention: usermention ? `by ${usermention}` : "",
  });

  const info = ctx.t("harem_inline_caption_info", {
    id: character.id,
    anime: (character.origem || "").charAt(0).toUpperCase() + (character.origem || "").slice(1),
    emoji_event: emoji_event ?? "",
    repitition: repetition !== null && repetition >= 1 ? `x${repetition}` : "",
  });

  const name = ctx.t("harem_inline_caption_name", {
    character_name: (character.character_name.charAt(0).toUpperCase() +
      character.character_name.slice(1)) || "" ,
  });

  const rarity = ctx.t("harem_inline_caption_rarity", {
    rarity_emoji: char.rarities?.emoji ?? "",
    rarity_name: char.rarities?.name ?? "",
  });

  const event = ctx.t("harem_inline_caption_event", {
    emoji_event: emoji_event ?? "",
    event_name:
      char.events.code === eventtype.NONE
        ? ""
        : (char.events.name ?? ""),
  });
  return `${title}

${name}
${info}
${rarity}

${event}`;
}
