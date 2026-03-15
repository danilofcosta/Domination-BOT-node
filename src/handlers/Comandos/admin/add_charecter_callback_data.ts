import {
  eventtype,
  raritytype,
  type characters_husbando,
} from "../../../../generated/prisma/browser.js";
import type { characters_waifu } from "../../../../generated/prisma/client.js";
import { prisma } from "../../../../lib/prisma.js";
import { getCharacter } from "../../../cache/cache.js";
import type { MyContext } from "../../../utils/customTypes.js";
import { mentionUser } from "../../../utils/metion_user.js";
import { Sendmedia } from "../../../utils/sendmedia.js";
import { create_caption } from "../../inline_query/create_caption.js";

// command,action,id_cached
// action : confirm ,cancel ,edit
export async function addCharacterCallbackData(ctx: MyContext) {
  if (!ctx.callbackQuery?.data) return;

  const [command, action, id_cached] = ctx.callbackQuery.data.split("_");
  console.log(command, action, id_cached);

  const character = getCharacter(Number(id_cached));

  if (!character) ctx.answerCallbackQuery(ctx.t("error-character-not-found"));

  if (action === "confirm") {
    // add no db
    const character_db = await prisma.characters_husbando.create({
      data: {
        character_name: character.nome,
        rarity_code: character.rarities ?? raritytype.COMMON,
        origem: character.anime,
        media_type: character.mediatype,
        data: character.data,
        event_code: character.events ?? eventtype.NONE,
        extras: (character.extras as any) ?? undefined,
      },
      include: {
        rarities: true,
        events: true,
      }
    });


    let capiton = create_caption({
      character: character_db ,
      ctx: ctx,
      username: null,
      user_id: null,
      repetition: null,
    });

    capiton += `\n\n${ctx.t("add_character_confirm", { usermention: mentionUser(character.username || "user", character.user_id || 0) })}`;

    await Sendmedia(ctx, character_db, capiton);
    return;
  }
}
