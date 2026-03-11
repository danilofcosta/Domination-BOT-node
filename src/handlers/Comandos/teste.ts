import type { characters_husbando, characters_waifu } from "../../../generated/prisma/browser.js";
import type { MyContext } from "../../utils/customTypes.js";
import { grupos } from "../listeners/contarMensagens.js";
import { doprar_per } from "../listeners/doprar_per.js";
const ID_DEV=6874062454
export async function teste(ctx: MyContext) {


    if (ctx.from?.id != ID_DEV) return
    const chatId = ctx.chat?.id;
    if (!chatId) return;

    if (!grupos[chatId]) {
        grupos[chatId] = {
            cont: 0,
            drop: null,
            drop_id: null,
            data: null,
        };
    }

    const result: [number, characters_husbando | characters_waifu] | null = await doprar_per(ctx); // result[0] = drop_id, result[1] = drop
    grupos[chatId].drop_id = result ? result[0] : null;
    grupos[chatId].drop = result ? result[1] : null;
    grupos[chatId].data = new Date();
}