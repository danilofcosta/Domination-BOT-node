import { ChatType, type MyContext } from "../../utils/customTypes.js";
import { prisma } from "../../../lib/prisma.js";
import type {
  characters_husbando,
  characters_waifu,
} from "../../../generated/prisma/client.js";
import { Sendmedia } from "../../utils/sendmedia.js";
import { createSecret } from "../../utils/form_caption.js";
import { RandomCharacter } from "../../utils/randomCharacter.js";

export async function doprar_per(
  ctx: MyContext,
): Promise<[number, characters_husbando | characters_waifu] | null> {
  

  const personagem =await RandomCharacter(ctx);
  if (!personagem) return null;

  // Criar legenda
  const caption = await createSecret(ctx, personagem);

  // Enviar mídia e obter message_id
  const messageResult = await Sendmedia(ctx, personagem, caption);
  const message_id = messageResult.message_id;

  return [message_id, personagem];
}
