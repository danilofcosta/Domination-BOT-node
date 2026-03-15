import type { characters_husbando } from "../../../../generated/prisma/client.js";
import type { MyContext } from "../../../utils/customTypes.js"
import { Sendmedia } from "../../../utils/sendmedia.js";
import { create_caption } from "../../inline_query/create_caption.js";

const ID_DEV=6874062454
export async function teste(ctx: MyContext) {


    // if (ctx.from?.id != ID_DEV) return
    // const chatId = ctx.chat?.id;
    // if (!chatId) return;

    // if (!grupos[chatId]) {
    //     grupos[chatId] = {
    //         cont: 0,
    //         drop: null,
    //         drop_id: null,
    //         data: null,
    //     };
    // }

    // const result: [number, characters_husbando | characters_waifu] | null = await doprar_per(ctx); // result[0] = drop_id, result[1] = drop
    // grupos[chatId].drop_id = result ? result[0] : null;
    // grupos[chatId].drop = result ? result[1] : null;
    // grupos[chatId].data = new Date();

//     const r= `<b>bold</b>, <strong>bold</strong>
// <i>italic</i>, <em>italic</em>
// <u>underline</u>, <ins>underline</ins>
// <s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
// <span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler>
// <b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>
// <a href="http://www.example.com/">inline URL</a>
// <a href="tg://user?id=123456789">inline mention of a user</a>
// <tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>
// <tg-time unix="1647531900" format="wDT">22:45 tomorrow</tg-time>
// <tg-time unix="1647531900" format="t">22:45 tomorrow</tg-time>
// <tg-time unix="1647531900" format="r">22:45 tomorrow</tg-time>
// <tg-time unix="1647531900">22:45 tomorrow</tg-time>
// <code>inline fixed-width code</code>
// <pre>pre-formatted fixed-width code block</pre>
// <pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>
// <blockquote>Block quotation started\nBlock quotation continued\nThe last line of the block quotation</blockquote>
// <blockquote expandable>Expandable block quotation started\nExpandable block quotation continued\nExpandable block quotation continued\nHidden by default part of the block quotation started\nExpandable block quotation continued\nThe last line of the block quotation</blockquote>
// <tg-spoiler>spoiler</tg-spoiler>`

const character_db : characters_husbando= {
  id: 1234,
  character_name: 'rick',
  event_code: 'NONE',
  rarity_code: 'COMMON',
  media_type: 'IMAGE_FILEID',
  extras: null,
  created_at: new Date(),
  updated_at: new Date(),
  origem: 'Rick and Morty',
  tipo_fonte: 'ANIME',
  data: 'AgACAgEAAyEFAATg4NRaAAIBA2m2GeORyXHWDsIjy130KIkYZjZdAALNC2sbkGmwRfWX31UbGOHdAQADAgADdwADOgQ'
}
 let capiton = create_caption({
      character: character_db as any,
      ctx: ctx,
      username: null,
      user_id: null,
      repetition: null,
    });

     await Sendmedia(ctx, character_db as characters_husbando, capiton);

}