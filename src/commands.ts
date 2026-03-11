import { CommandGroup } from "@grammyjs/commands";
import type { MyContext } from "./utils/customTypes.js";
import { Myinfos } from "./handlers/Comandos/myinfos.js";
import { favCharacter } from "./handlers/Comandos/fav.js";
import { start } from "./handlers/Comandos/start.js";
import { table } from "node:console";
import { HaremHandler } from "./handlers/Comandos/harem.js";
import { giftHandler } from "./handlers/Comandos/gift.js";
import { dominar } from "./handlers/Comandos/dominar.js";
import { teste } from "./handlers/Comandos/teste.js";

const tagbotCommands = new CommandGroup<MyContext>();
tagbotCommands.command("dominar", "Dominate a character", dominar);
tagbotCommands.command("teste", "Test the bot", teste);

tagbotCommands.command("gift", "Gift a character to another user", giftHandler);

tagbotCommands.command("myinfos", "Show your information", Myinfos);
tagbotCommands.command("fav", "Show your favorite character", favCharacter);
tagbotCommands.command(
  "start",
  "Start the bot and get a greeting message",
  start,
);
tagbotCommands.command(
  "harem",
  "Get information about the Harem feature",
  HaremHandler,
);
// tagbotCommands.command("broadcast", "Broadcast a message to all groups and users", broadcastHandler);

const devCommands = new CommandGroup<MyContext>();
// devCommands.command("broadcast", "Broadcast a message to all groups and users", broadcastHandler);

export { tagbotCommands, devCommands };
