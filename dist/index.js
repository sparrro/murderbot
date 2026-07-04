"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const discord_js_1 = require("discord.js");
const findMods_1 = require("./utils/findMods");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.Guilds
    ]
});
client.once("clientReady", () => {
    console.log(`Logged in as ${client.user.tag}`);
});
client.login(config_1.TOKEN);
/* client.on("guildCreate", async guild => {
    const mods = await findMods(guild);
    for(const mod of mods.values()) {
        console.log(mod.user.globalName)
    }
    for (const mod of mods.values()) {
        try {
            await mod.send(
                `This is a test message
                If you are a moderator I am working as intended
                If you are not a moderator please inform Sparrro that he made me wrong again`)
        } catch {
            console.log(`Failed to DM ${mod}`);
        }
    }
}) */
const joins = [];
client.on("guildMemberAdd", (member) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = member.guild;
    const now = Date.now();
    joins.push(now);
    while (joins.length && now - joins[0] > 30000) {
        joins.shift();
    }
    if (joins.length >= 10) {
        const mods = yield (0, findMods_1.findMods)(guild);
        for (const mod of mods.values()) {
            try {
                yield mod.send("Possible raid detected; 10 or more people joined within last 30 seconds");
            }
            catch (_a) {
                console.log(`Failed to DM ${mod}`);
            }
        }
    }
}));
