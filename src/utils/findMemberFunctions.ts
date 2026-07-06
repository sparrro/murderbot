import { Guild } from "discord.js";
export const findMods = async (server: Guild) => {
    await server.members.fetch();

    const modRoles = ["MOD", "Moderator"]

    return server.members.cache.filter(member =>
        member.roles.cache.some(role => modRoles.includes(role.name))
    )
}

export const findByUsername = async (server: Guild, username: string) => {
    await server.members.fetch();

    return server.members.cache.filter(member => member.user.username === username).first();
}

export const findAllMembers = async (server: Guild) => {
    await server.members.fetch();
    return server.members.cache.values();
}