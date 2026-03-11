// src/types.ts
import type { Context } from "grammy";
import type { I18nFlavor } from "@grammyjs/i18n";

export enum ChatType {
  WAIFU = "waifu",
  HUSBANDO = "husbando",
}
export enum NODE_ENV {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}
interface BotSettings {
  genero: ChatType;
}
// Aqui você junta o contexto padrão + o I18n
export type MyContext = Context & I18nFlavor & BotSettings;
