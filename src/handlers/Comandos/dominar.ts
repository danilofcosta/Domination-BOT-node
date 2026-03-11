import { language } from "../../../generated/prisma/enums.js";
import { prisma } from "../../../lib/prisma.js";
import { ChatType, type MyContext } from "../../utils/customTypes.js";
import { mentionUser } from "../../utils/metion_user.js";
import { grupos } from "../listeners/contarMensagens.js";

function verificarNome(personagem: string, tentativa: string) {
  const ignorar = ["da", "de", "do", "dos", "das","the",  "a", "an", "the", "&"];

  const partes = personagem
    .toLowerCase()
    .split(/\s+/)
    .filter((p) => !ignorar.includes(p));

  tentativa = tentativa.toLowerCase().trim();

  if (partes.includes(tentativa)) return true;

  if (tentativa === partes.join(" ")) return true;

  return false;
}

function calcularTempo(per: { data: Date | null }) {
  if (!per.data) return "desconhecido";

  const agora = new Date();
  const diferenca = agora.getTime() - per.data.getTime();

  const segundos = Math.floor(diferenca / 1000);
  const minutos = Math.floor(diferenca / 60000);
  const horas = Math.floor(diferenca / 3600000);

  if (segundos < 60) {
    return `${segundos} seg`;
  }

  if (minutos < 60) {
    return `${minutos} min`;
  }

  return `${horas} h`;
}

function successDominarMessage(
  ctx: MyContext,
  drop: {
    character_name: string;
    rarity_code: string;
    origem: string;
    id: number;
    rarities: { emoji: string | null; name: string | null } | null;
    events: { name: string | null; emoji: string | null }[] | null;
    //  include: { rarities: true, events: true },
  },
  time: string,
) {
  //success_dominar_title = ✅ { $usermention }, você tem { $genero }!
  const success_dominar_title = ctx.t("success_dominar_title", {
    usermention: mentionUser(ctx.from?.first_name || "user", ctx.from?.id || 0),
    genero: ctx.genero === ChatType.WAIFU ? "uma waifu" : "um husbando",
  });

  const success_dominar_name = ctx.t("success_dominar_name", {
    character_name: drop.character_name,
  });

  const success_dominar_anime = ctx.t("success_dominar_anime", {
    anime: drop.origem,
  });

  const success_dominar_rarity = ctx.t("success_dominar_rarity", {
    rarity: drop.rarities?.emoji
      ? `${drop.rarities.emoji} ${drop.rarities.name}`
      : "Desconhecida",
  });

  const success_dominar_time = ctx.t("success_dominar_time", {
    time,
  });

  const success_dominar = `${success_dominar_title}\n\n${success_dominar_name}\n${success_dominar_anime}\n${success_dominar_rarity}\n\n${success_dominar_time}`;

  return success_dominar;
}

// grupos
export async function dominar(ctx: MyContext) {
  const tentativa = String(ctx.match).trim();

  const per = grupos[ctx.chat?.id || 0];
  const drop = per ? per.drop : null;

  if (!drop) {
    // ctx.reply("Nenhum personagem disponível para dominar no momento.");
    ctx.answerCallbackQuery(ctx.t("not-charater-to-dominar"));
    return;
  }

  const nomePersonagem = drop.character_name;
// caso tentativa seja diferente do nome do personagem
  if (!verificarNome(nomePersonagem, tentativa)) {
    const chatId = String(ctx.chat?.id).slice(4);
    const url_mensagem_drop = `https://t.me/c/${chatId}/${per?.drop_id}`;

  await  ctx.reply(ctx.t("name-not-found"), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: ctx.t("bt-tentative-again"),
              url: url_mensagem_drop,
            },
          ],
        ],
      },
    });

    return;//
  }
  if (verificarNome(nomePersonagem, tentativa)) {
    await prisma.$transaction(async (tx) => {
      // criar usuário caso não exista
      await tx.users.upsert({
        where: {
          telegram_id: Number(ctx.from?.id),
        },
        update: {},
        create: {
          telegram_user_data: JSON.stringify(ctx.from),
          preferred_language: language.PT,
          telegram_id: Number(ctx.from?.id),
          waifu_config: {},
          husbando_config: {},
          favorite_waifu_id: Number(drop.id),
        },
      });

      // adicionar presente na coleção do receptor
      await tx.waifu_collection.create({
        data: {
          telegram_id: Number(ctx.from?.id),
          character_id: Number(drop.id),
        },
      });
    });
  }

 await ctx.reply(successDominarMessage(ctx, drop as any, calcularTempo(per!)), {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: ctx.t("success_dominar_btn"),
            switch_inline_query_current_chat: "harem_user_" + ctx.from?.id,
          },
        ],
      ],
    },
  });

   // resetar o contador de mensagens
     grupos[ctx.chat?.id || 0] = {
      cont: 0,
      drop: null,
      drop_id: null,
      data: null,
    };

  console.log("dominar:", tentativa);
}
