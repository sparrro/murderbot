import { Guild, GuildMember, Message } from "discord.js";
import { findByUsername, findFather, findMods } from "./findMemberFunctions";

export const quarantineUserAndAlertMods = async (user: GuildMember, message: Message) => {
    const mods = await findMods(user.guild);
    const father = await findFather(user.guild);
    for (const mod of mods) {
        try {
            await mod.send(`I have put ${user.displayName} because I believe their message ${message.content} was spam and would like a human moderator to investigate further`)
        } catch {
            const errorMsg = `Failed to dm mod ${mod.displayName} regarding ${user.displayName} being quarantined`
            console.log(errorMsg)
            await father?.send(errorMsg);
        }
    }
};