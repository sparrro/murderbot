import { Guild, GuildMember, Message } from "discord.js";
import { findByUsername, findFather, findMods } from "./findMemberFunctions";

export const quarantineUserAndAlertMods = async (user: GuildMember, message: Message) => {
    const mods = await findMods(user.guild);
    const father = await findFather(user.guild);
    let timedOut: number | null | undefined
    try {
        timedOut = (await user.timeout(1000 * 60 * 60 * 24)).communicationDisabledUntilTimestamp;
    } catch {
        const errorMsg = `Failed to quarantine ${user.displayName}`;
        console.log(errorMsg);
        await father?.send(errorMsg);
    }
    if (timedOut) {
        for (const mod of mods) {
            try {
                await mod.send(`I have put ${user.displayName} in quarantine because I believe their message ${message.content} was spam and would like a human moderator to make a final determination`);
            } catch {
                const errorMsg = `Failed to dm mod ${mod.displayName} regarding ${user.displayName} being quarantined`;
                console.log(errorMsg);
                await father?.send(errorMsg);
            }
        }
    }
};