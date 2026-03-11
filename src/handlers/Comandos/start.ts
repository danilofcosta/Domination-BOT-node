import type { MyContext } from "../../utils/customTypes.js";

export function start(ctx: MyContext) {
    const greeting = ctx.t("start-greeting");
    ctx.reply(greeting);
}