import { Guild } from "discord.js";
export const findMods = async (server: Guild) => {
    await server.members.fetch();

    const modRoles = ["MOD", "Moderator"]

    return server.members.cache.filter(member =>
        member.roles.cache.some(role => modRoles.includes(role.name))
    )
}