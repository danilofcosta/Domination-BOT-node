import type {
  ParseMode,
  InlineQueryResult,
  InlineQueryResultPhoto,
  InlineQueryResultCachedPhoto,
  InlineQueryResultVideo,
  InlineQueryResultCachedVideo,
} from "grammy/types";
import {
  mediatype,
  type characters_husbando,
  type characters_waifu,
  type events,
  type rarities,
} from "../../../generated/prisma/client.js";
import type { MyContext } from "../../utils/customTypes.js";
import { create_caption } from "./create_caption.js";

export interface Params {
  character: characters_husbando | characters_waifu;
  ctx: MyContext;
  username: string | null;
  user_id: number | null;
  repetition: number | null;
}
// Função para criar um resultado de consulta inline com base no tipo de mídia do personagem
export function createResult(params: Params) {
  const capiton = create_caption(params);
  // const capiton = '[titulo](tg://user?id=123456789)';

  switch (params.character.media_type) {
    case mediatype.IMAGE_URL:
      return {
        type: "photo",
        id: `${params.character.id}`,
        photo_url: params.character.data,
        thumbnail_url: params.character.data,
        title: params.character.character_name,
        caption_entities: [],

        description: params.character.origem,
        caption: capiton,
        parse_mode: "HTML" as ParseMode,
      } as InlineQueryResultPhoto;
    case mediatype.IMAGE_FILEID:
      return {
        type: "photo",
        id: "fileid" + `${params.character.id}`,
        photo_file_id: params.character.data,
        title: params.character.character_name,

        description: params.character.origem,
        caption: capiton,
        parse_mode: "HTML" as ParseMode,
      } as InlineQueryResultCachedPhoto;

    case mediatype.VIDEO_URL:
      return {
        type: "video",
        id: "url" + `${params.character.id}`,
        title: params.character.character_name,
        mime_type: "video/mp4",

        description: params.character.origem,
        video_url: params.character.data,
        thumbnail_url: params.character.data,
        caption: capiton,
        parse_mode: "HTML" as ParseMode,
      } as InlineQueryResultVideo;
    case mediatype.VIDEO_FILEID:
      return {
        type: "video",
        id: "fileid" + `${params.character.id}`,
        mime_type: "video/mp4",

        video_file_id: params.character.data,
        caption: capiton,
        title: params.character.character_name,

        description: params.character.origem,

        parse_mode: "HTML" as ParseMode,
      } as InlineQueryResultCachedVideo;

    default:
      const url =
        "https://i.pinimg.com/avif/736x/58/2d/9b/582d9be3d56b3f46ba7a540d761ea6e2.avfhttps://i.pinimg.com/avif/736x/58/2d/9b/582d9be3d56b3f46ba7a540d761ea6e2.avf";
      return {
        type: "photo",
        id: "url" + `${params.character.id}`,
        photo_url: url,
        thumbnail_url: url,
        caption: capiton,
        parse_mode: "HTML" as ParseMode,
      };
  }
}
