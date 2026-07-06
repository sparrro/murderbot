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
const findMemberFunctions_1 = require("./utils/findMemberFunctions");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
client.once("clientReady", () => {
    console.log(`Logged in as ${client.user.tag}`);
});
client.login(config_1.TOKEN);
//test dm sent to all moderators
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
client.on("raw", packet => {
    console.log("Raw event: " + packet.t);
});
//raid warning system
const joins = [];
client.on("guildMemberAdd", (member) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${member.displayName} just joined`);
    const guild = member.guild;
    const now = Date.now();
    joins.push(now);
    while (joins.length && now - joins[0] > 30000) {
        console.log(joins);
        joins.shift();
    }
    if (joins.length >= 10) {
        const mods = yield (0, findMemberFunctions_1.findMods)(guild);
        for (const mod of mods.values()) {
            try {
                yield mod.send("Possible raid detected; 10 or more people joined within last 30 seconds");
            }
            catch (_a) {
                console.log(`Failed to DM ${mod}`);
            }
        }
    }
    if (joins.length >= 25) {
        //gör något mer drastiskt?
    }
    if (joins.length >= 50) {
        //sätt servern i karantän och skicka mig en lista över de senaste 50 medlemmarna som gick med
    }
}));
//spam detector
const messages = [];
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    console.log(`Message sent by ${message.author.displayName}: ${message.content}`);
    messages.push(message); //if the bot is going to be run 24/7 from some cloud service, make it clean this up every now and then
    const userId = message.author.id;
    const usersMsgs = messages.filter(msg => msg.author.id === userId);
    if (usersMsgs.length === 1)
        return;
    if (usersMsgs[usersMsgs.length - 1].createdTimestamp - usersMsgs[usersMsgs.length - 2].createdTimestamp < 1000) {
        console.log(`Suspiciously fast message sent by ${message.author.displayName}`);
        yield message.author.send("That was really fast wow");
    }
}));
//meddela nya medlemmar om att de behöver en geografisk roll
//sparka medlemmar som inte har en geografisk roll 24 timmar efter att de gick med
