import { randomUUID } from "crypto";
import { eventtype, mediatype, raritytype } from "../../../../generated/prisma/enums.js";
import { characterCache, setCharacter } from "../../../cache/cache.js";
import { ChatType, type MyContext } from "../../../utils/customTypes.js";
import { mentionUser } from "../../../utils/metion_user.js";

export async function AddCharacter(ctx: MyContext) {
  const reply = ctx.message?.reply_to_message;

  if (!reply) {
    console.log("No reply message");
    return;
  }

  const fileId = reply.photo?.at(-1)?.file_id;
  const text = reply.text ?? reply.caption ?? "";

  const [nome, anime] = text.split(",");

  if (!fileId || !nome || !anime) {
    console.log("Missing fileId, nome or anime");
    return;
  }

  await confirmCharacter(ctx, {
   
    nome: nome.trim(),
    anime: anime.trim(),
    genero: ChatType.HUSBANDO,
    mediatype: mediatype.IMAGE_FILEID,
    data: fileId,
    username: ctx.from?.first_name || "",
    user_id: ctx.from?.id || 0,
    extras: JSON.parse(JSON.stringify(ctx.from)),
  });
}

export interface PreCharacter {
  nome: string;
  anime: string;
  rarities?: raritytype;
  events?: eventtype;
  genero: ChatType;
  mediatype: mediatype;
  data: string;
  username: string;
  user_id: number;
  extras?: JSON;
}

async function confirmCharacter(ctx: MyContext, data_character: PreCharacter) {
const { nome, anime, rarities, events, genero, mediatype, data, username, user_id } = data_character;
    

  const text =
`Nome: ${nome}
Anime: ${anime}
Genero: ${genero}
Mediatype: ${mediatype}
Data: <code>${data}</code>
Rarities: ${rarities ?? "comum"}
Events: ${events} ?? "sem evento "` ;

const id = randomUUID();

setCharacter(Number(id), data_character);





  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Sim", callback_data: "addcharacter_confirm_"+id },
          { text: "Nao", callback_data: "addcharacter_cancel_"+id },
          { text: "Editar", callback_data: "addcharacter_edit_"+id },
        ],
      ],
    },
  });
}