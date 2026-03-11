// initializeBot.ts
import { Bot } from "grammy";
import { I18n } from "@grammyjs/i18n";
import path from "node:path";
import { fileURLToPath } from "node:url";

import localeNegotiator from "./utils/localeNegotiator.js";
import { ChatType, type MyContext } from "./utils/customTypes.js";
import { tagbotCommands, devCommands } from "./commands.js";
import { listeners } from "./listeners.js";
import { callbacks } from "./callbackQuery.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, "locales");

export default async function initializeBot(
  ChatType: ChatType,
  BOT_TOKEN: string,
) {
  console.log("Iniciando bot");
  const bot = new Bot<MyContext>(BOT_TOKEN as string);

  console.log("iniciado I18n");
  const i18n = new I18n<MyContext>({
    defaultLocale: "pt",
    directory: localesDir,
    fluentBundleOptions: { useIsolating: false },
    localeNegotiator,
  });

  bot.use(i18n.middleware());

  bot.use(async (ctx, next) => {
    ctx.genero = ChatType;
    await next();
  });

  // bot.use(devCommands);
  bot.use(tagbotCommands);
  // await tagbotCommands.setCommands(bot);

  bot.use(listeners);
  bot.use(callbacks);

  // const me = await bot.api.getMe();

  console.log(`Bot iniciado!`);

  bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Erro ao processar update ${ctx.update.update_id}: `, err.error);

  const e = err.error;

  if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error(e);
  }
});
  return bot;
}
