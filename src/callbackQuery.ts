import { Composer } from "grammy";
import type { MyContext } from "./utils/customTypes.js";
import { favConfirmHandler } from "./handlers/callbacks/favCallback.js";
import { giftConfirmHandler } from "./handlers/callbacks/giftCallback.js";
import { haremCallback } from "./handlers/callbacks/haremCallback.js";

const callbacks = new Composer<MyContext>();

callbacks.callbackQuery(/^fav_/, favConfirmHandler);
callbacks.callbackQuery(/^gift_/, giftConfirmHandler);
callbacks.callbackQuery(/^harem_/, haremCallback);

export { callbacks };