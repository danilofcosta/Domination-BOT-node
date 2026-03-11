import type {
  characters_husbando,
  characters_waifu,
} from "../../generated/prisma/client.js";
import { ChatType, type MyContext } from "./customTypes.js";
import { prisma } from "../../lib/prisma.js";

export async function createSecret(
  ctx: MyContext,
  character?: characters_husbando | characters_waifu,
) {
  if (!character) return "";

  // Buscar a raridade do personagem
  const rarity = await prisma.rarities.findUnique({
    where: { code: character.rarity_code },
  });

  const emoji_raridade = rarity?.emoji || "";

  // ✅ operador ternário no lugar do "if ... else"
  const generoTexto =
    ctx.genero === ChatType.HUSBANDO ? "um husbando" : "uma waifu";

  // Criar a legenda usando i18n
  const txr = ctx.t("new_character_secret_caption", {
    emoji_raridade: emoji_raridade,
    charater_genero: generoTexto,
  });

  return txr;
}
