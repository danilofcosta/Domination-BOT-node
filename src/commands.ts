import { CommandGroup } from "@grammyjs/commands";
import type { MyContext } from "./utils/customTypes.js";

// Handlers
import { start } from "./handlers/Comandos/globais/start.js";
import { dominar } from "./handlers/Comandos/users/dominar.js";
import { teste } from "./handlers/Comandos/users/teste.js";
import { giftHandler } from "./handlers/Comandos/users/gift.js";
import { topHander } from "./handlers/Comandos/users/top.js";
import { Myinfos } from "./handlers/Comandos/users/myinfos.js";
import { favCharacter } from "./handlers/Comandos/users/fav.js";
import { HaremHandler } from "./handlers/Comandos/users/harem.js";
import { AddCharacter } from "./handlers/Comandos/admin/add_charecter.js";


const botPrefix = process.env.TYPE_BOT?.charAt(0) ?? "";
const typeBot = process.env.TYPE_BOT;
const prefixs ='./!'
const options = { ignoreCase: true };

const tagbotCommands = new CommandGroup<MyContext>();


// comandos gerais
tagbotCommands.command("dominar", "Dominate a character", dominar, options);
tagbotCommands.command("teste", "Test the bot", teste);
tagbotCommands.command("start", "Start the bot and get a greeting message", start , options);

// comandos com prefixo do bot
tagbotCommands.command(`${botPrefix}gift`, "Gift a character to another user", giftHandler , options);
tagbotCommands.command(`${botPrefix}top`, "Show the top players", topHander   , options);
tagbotCommands.command(`${botPrefix}info`, "Show your information", Myinfos , options);
tagbotCommands.command(`${botPrefix}fav`, "Show your favorite character", favCharacter  , options);

// Harem

tagbotCommands.command(
  `my${typeBot}s`,
  "Get information about the Harem feature",
  HaremHandler,
  options
);


// comando admis 
const adminCommands = new CommandGroup<MyContext>(); // adicionar  verificação admin
adminCommands.command("addchar", "Add a character to the database", AddCharacter);

const devCommands = new CommandGroup<MyContext>();
// devCommands.command("broadcast", "Broadcast a message to all groups and users", broadcastHandler);

export { tagbotCommands, devCommands, adminCommands };
