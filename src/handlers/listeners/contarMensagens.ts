import console from "node:console";
import { ChatType, type MyContext } from "../../utils/customTypes.js";
import { botNewgroupMember } from "./botNewgroupMember.js";
import type {
  characters_husbando,
  characters_waifu,
} from "../../../generated/prisma/client.js";
import { doprar_per } from "./doprar_per.js";

let DROP = 100;
let UNDROP = DROP + 5;

interface InfoGrupo {
  cont: number; // contador de mensagens
  drop: characters_husbando | characters_waifu | null; // qualquer dado adicional
  drop_id: number | null; // id da mensagem do drop, para possível exclusão
  data: Date | null; // qualquer data ou texto
}

export const grupos: Record<number, InfoGrupo> = {};
export async function contarMensagens(ctx: MyContext) {
  // if (!ctx.new_chat_participant) return;

  if (ctx.message?.new_chat_members) {
    const newMembers = ctx.message.new_chat_members[0];
    if (newMembers?.id === ctx.me.id) {
      botNewgroupMember(ctx);
      return;
    }
  }

  if (ctx.message?.left_chat_member) {
    const leftMember = ctx.message.left_chat_member;

    console.log("bot foi removido ou saiu do grupo");
    // console.log(ctx);
    return;
  }
  if (!ctx.message || !ctx.chat) return;

  const chatId = ctx.chat.id;
  if (!grupos[chatId]) {
    grupos[chatId] = {
      cont: 0,
      drop: null,
      drop_id: null,
      data: null,
    };
  }
  console.log("---------------------------------------------------");

  console.log("Mensagem recebida no grupo", ctx.chat.title, chatId);
  console.log("Mensagem recebida no grupo", chatId);
  console.log("Mensagem: ", ctx.message.from.first_name, ctx.message.text);
  // console.log("Chat: ", ctx);
  console.log("---------------------------------------------------");

  grupos[chatId].cont += 1;
  console.log(
    "Contador de mensagens: ",
    grupos[chatId].cont,
    "DROP: ",
    DROP,
    "UNDROP: ",
    UNDROP,
    ctx.chat.title,
  );
    console.log("---------------------------------------------------");
  // if (process.env.NODE_ENV === "development") {
  //   console.log("Modo desenvolvimento: DROP definido para 1");
  //   if (chatId != -1001528803759) {
  //     console.log("grupo não é developer:", chatId, ctx.chat.title);
  //     {
  //       const result: [number, characters_husbando | characters_waifu] | null =
  //         await doprar_per(ctx);
  //       grupos[chatId].drop_id = result ? result[0] : null;
  //       grupos[chatId].drop = result ? result[1] : null;
  //       grupos[chatId].data = new Date();
  //     }
  //   }
  // }

  if (grupos[chatId].cont === DROP) {
    const result: [number, characters_husbando | characters_waifu] | null =
      await doprar_per(ctx); // result[0] = drop_id, result[1] = drop
    grupos[chatId].drop_id = result ? result[0] : null;
    grupos[chatId].drop = result ? result[1] : null;
    grupos[chatId].data = new Date();
  } else if (grupos[chatId].cont >= UNDROP && grupos[chatId].drop_id !== null) {
    const data: InfoGrupo = grupos[chatId];

    const charater_nome = data.drop
      ? data.drop.character_name
      : "Nenhum personagem";
    const character_anime = data.drop ? data.drop.origem : "Nenhum anime";
    const charater_genero =
      ctx.genero === ChatType.HUSBANDO ? "o husbando" : "a waifu";

    console.log("Contador de mensagens: ", grupos[chatId].cont);
    const txt = ctx.t("drop_character_secret_caption", {
      charater_nome: charater_nome,
      charater_anime: character_anime,
      charater_genero,
    });
    if (data.drop_id !== null) {
      await ctx.api.deleteMessage(chatId, data.drop_id);
    }

    await ctx.reply(txt, { parse_mode: "HTML" });
  }
}
