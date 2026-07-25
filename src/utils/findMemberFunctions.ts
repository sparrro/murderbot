import { Guild } from "discord.js";
import { MY_ID, LOLAPAZ_ID, AMY_ID, ENEMY_ID } from "../config";
export const findMods = async (server: Guild) => {
    await server.members.fetch();

    const modRoles = ["MOD", "Moderator"]; //MOD is redundant but it still works so whatever

    const mods = server.members.cache.filter(member =>
        member.roles.cache.some(role => modRoles.includes(role.name))
    ).values();

    return mods;
};

export const findByUsername = async (server: Guild, username: string) => {
    await server.members.fetch();

    return server.members.cache.filter(member => member.user.username === username).first();
};

export const findFather = async (server: Guild) => {
    await server.members.fetch();
    return server.members.cache.find(user => user.id === MY_ID);
};

export const findAllMembers = async (server: Guild) => {
    await server.members.fetch();
    return server.members.cache.values();
};

export const findTheOne = async (server: Guild) => {
    await server.members.fetch();
    return server.members.cache.find(user => user.id === AMY_ID);
};

export const findTheEnemy = async (server: Guild) => {
    await server.members.fetch();
    return server.members.cache.find(user => user.id === ENEMY_ID);
};