import { ChatType, type MyContext } from "../../utils/customTypes.js";
import { prisma } from "../../../lib/prisma.js";
import type {
  characters_husbando,
  characters_waifu,
} from "../../../generated/prisma/client.js";
import { Sendmedia } from "../../utils/sendmedia.js";
import { createSecret } from "../../utils/form_caption.js";

export async function doprar_per(
  ctx: MyContext,
): Promise<[number, characters_husbando | characters_waifu] | null> {
  // Escolher tabela com base no gênero
  const isHusbando = ctx.genero === ChatType.HUSBANDO;

  const total = isHusbando
    ? await prisma.characters_husbando.count()
    : await prisma.characters_waifu.count();

  if (total === 0) return null;

  // Índice aleatório
  const randomIndex = Math.floor(Math.random() * total);

  // Buscar item aleatório
  const randomItem = isHusbando
    ? await prisma.characters_husbando.findMany({
        skip: randomIndex,
        take: 1,
        include: { rarities: true, events: true },
      })
    : await prisma.characters_waifu.findMany({
        skip: randomIndex,
        take: 1,
        include: { rarities: true, events: true },
      });

  const personagem = randomItem[0];
  if (!personagem) return null;

  // Criar legenda
  const caption = await createSecret(ctx, personagem);

  // Enviar mídia e obter message_id
  const messageResult = await Sendmedia(ctx, personagem, caption);
  const message_id = messageResult.message_id;

  return [message_id, personagem];
}
