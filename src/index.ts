import initializeBot from "./initializeBot.js";
import "dotenv/config";
import { ChatType } from "./utils/customTypes.js";

if (
  !process.env.BOT_TOKEN_WAIFU ||
  !process.env.BOT_TOKEN_HUSBANDO ||
  !process.env.TYPE_BOT
) {
  if (!process.env.BOT_TOKEN_WAIFU) {
    console.error(
      "BOT_TOKEN_WAIFU is not defined in the environment variables.",
    );
  }
  if (!process.env.BOT_TOKEN_HUSBANDO) {
    console.error(
      "BOT_TOKEN_HUSBANDO is not defined in the environment variables.",
    );
  }
  if (!process.env.TYPE_BOT) {
    console.error("TYPE_BOT is not defined in the environment variables.");
  }
  process.exit(1);
}
const BOT_TOKEN = process.env.TYPE_BOT === ChatType.WAIFU
  ? process.env.BOT_TOKEN_WAIFU : process.env.BOT_TOKEN_HUSBANDO

console.log('type bot',BOT_TOKEN, process.env.TYPE_BOT);




const bot = await initializeBot(
  process.env.TYPE_BOT as ChatType,
  BOT_TOKEN as string
);

await bot.api.deleteWebhook({ drop_pending_updates: true });

// bot.on("message", (ctx) => ctx.react("👍"));

await bot.start({
  drop_pending_updates: true,
  onStart: async () => {
    if (process.env.CHAT_ID) {
      await bot.api.sendMessage(process.env.CHAT_ID, "Bot iniciado");
    }
  },
});
