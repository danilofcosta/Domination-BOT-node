import type { MyContext } from "./customTypes.js";
import {
  mediatype,
  type characters_husbando,
  type characters_waifu,
} from "../../generated/prisma/client.js";
import { InputFile } from "grammy";
import { InlineKeyboard } from "grammy";

export async function Sendmedia(
  ctx: MyContext,
  per: characters_husbando | characters_waifu | null,
  caption: string,
  reply_markup?: InlineKeyboard,
) {
  if (!per) {
    return ctx.reply(caption, {
      parse_mode: "HTML",
      ...(reply_markup && { reply_markup }),
    });
  }

  const { media_type: type, data } = per;

  const options = {
    caption,
    parse_mode: "HTML" as const,
    ...(reply_markup && { reply_markup }),
  };

  try {
    // IMAGENS
    if (type === mediatype.IMAGE_URL || type === mediatype.IMAGE_FILEID) {
      return await ctx.replyWithPhoto(data, options);
    }

    if (type === mediatype.IMAGE_BASE64 || type === mediatype.IMAGE_BYTES) {
      const buffer = Buffer.from(
        data,
        type === mediatype.IMAGE_BASE64 ? "base64" : "binary",
      );

      return await ctx.replyWithPhoto(new InputFile(buffer), options);
    }

    if (type === mediatype.IMAGE_FILE) {
      return await ctx.replyWithPhoto(new InputFile(data), options);
    }

    // VIDEOS
    if (type === mediatype.VIDEO_URL || type === mediatype.VIDEO_FILEID) {
      return await ctx.replyWithVideo(data, options);
    }

    if (type === mediatype.VIDEO_BASE64 || type === mediatype.VIDEO_BYTES) {
      const buffer = Buffer.from(
        data,
        type === mediatype.VIDEO_BASE64 ? "base64" : "binary",
      );

      return await ctx.replyWithVideo(new InputFile(buffer), options);
    }

    if (type === mediatype.VIDEO_FILE) {
      return await ctx.replyWithVideo(new InputFile(data), options);
    }

    return ctx.reply("Tipo de mídia não suportado.");
  } catch (error) {
    console.error("Erro ao enviar mídia:", error);
    return ctx.reply("Erro ao enviar mídia.");
  }
}
