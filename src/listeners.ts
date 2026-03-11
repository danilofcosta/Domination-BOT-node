import { Composer } from "grammy";
import type { MyContext } from "./utils/customTypes.js";
import { contarMensagens } from "./handlers/listeners/contarMensagens.js";
import { Harem_iniline_query } from "./handlers/inline_query/harem_inline_query.js";
import { getCharacters, getCharactersall } from "./handlers/inline_query/inline_query.js";

const listeners = new Composer<MyContext>();

listeners.chatType(["group", "supergroup"]).on("message", contarMensagens);
listeners.on("inline_query", async (ctx) => {
  console.log("inline query:", ctx.inlineQuery?.query);
  const query = ctx.inlineQuery.query || "";

  if (query.startsWith("harem_user_")) {
    return Harem_iniline_query(ctx);
  }

  if (query !== "" && !isNaN(Number(query))) {
  await  getCharacters(ctx);
  }
  if (query === "") {
     await  getCharactersall(ctx);
  }

  return;
});

// listeners.chatType("private")
// .on("my_chat_member", myPrivateChatMemberHandler); //

export { listeners };
