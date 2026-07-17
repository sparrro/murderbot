import { Guild, GuildMember, Message, RoleResolvable } from "discord.js";
import { findByUsername, findFather, findMods } from "./findMemberFunctions";
import { MODROLE_ID } from "../config";

export const quarantineUserAndAlertMods = async (user: GuildMember, message: Message) => {
    const mods = await findMods(user.guild);
    const father = await findFather(user.guild);
    let timedOut: number | null | undefined;
    try {
        timedOut = (await user.timeout(1000 * 60 * 60 * 24)).communicationDisabledUntilTimestamp;
    } catch {
        const errorMsg = `Failed to quarantine ${user.displayName}`;
        console.log(errorMsg);
        await father?.send(errorMsg);
    };
    if (timedOut) {
        for (const mod of mods) {
            try {
                await mod.send(`I have put ${user.displayName} in quarantine because I believe their message ${message.content} was spam and would like a human moderator to make a final determination`);
            } catch {
                const errorMsg = `Failed to dm mod ${mod.displayName} regarding ${user.displayName} being quarantined`;
                console.log(errorMsg);
                await father?.send(errorMsg);
            };
        };
    };
};

export const demoteModerator = async (user: GuildMember) => {
    const father = await findFather(user.guild);
    const isModerator = user.roles.cache.some(role => role.id == MODROLE_ID);
    if (!isModerator) {
        const errorMsg = `${user.displayName} is already not a moderator`;
        console.log(errorMsg);
        await father?.send(errorMsg);
        return;
    };
    try {
        await user.roles.remove(MODROLE_ID as RoleResolvable);
        const successMsg = `Demoted ${user.displayName}`;
        console.log(successMsg);
        await father?.send(successMsg);
    } catch {
        const errorMsg = `Failed to demote ${user.displayName}`
        console.log(errorMsg);
        await father?.send(errorMsg);
    };
};

export const kickUser = async (user: GuildMember, reason: string) => {
    const father = await findFather(user.guild);
    try {
        await user.kick(reason);
    } catch {
        const errorMsg = `Failed to kick ${user.displayName} for ${reason}`;
        console.log(errorMsg);
        await father?.send(errorMsg);
    };
};

export const banUser = async (user: GuildMember, reason: string) => {
    const father = await findFather(user.guild);
    try {
        await user.ban({
            reason: reason
        });
    } catch {
        const errorMsg = `Failed to ban ${user.displayName} for ${reason}`;
        console.log(errorMsg);
        await father?.send(errorMsg);
    };
};

//to add: demote all but trusted moderators; quarantine whole server