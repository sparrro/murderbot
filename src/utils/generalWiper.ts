import { Guild, TextChannel } from "discord.js";
import { GENERAL_CHANNEL_ID } from "../config";


export const generalWiper = async (server: Guild) => {
    await server.channels.fetch();
    const generalCh = server.channels.cache.get(GENERAL_CHANNEL_ID!) as TextChannel;
    if (!generalCh) {
        console.log("Couldn't find the general channel");
        return;
    };
    const dygn = 1000 * 60 * 60 * 24;
    let before: string | undefined;
    while (true) {
        const messages = await generalCh.messages.fetch({ limit: 100, before });
        if (messages.size == 0) break;
        const delenda = messages.filter(message => (!message.pinned && message.createdTimestamp < Date.now() - dygn));
        await generalCh.bulkDelete(delenda, true);
        before = messages.last()!.id;
    };
    console.log("General wiped at " + (new Date().toLocaleString()) + "...");
    setTimeout(async () => await generalWiper(server), 1000 * 60 * 15);
};