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
const reminder = require("./utils/reminder");
//cache
const messages = [];
const joins = [];
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.DirectMessages
    ]
});
client.once("clientReady", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Logged in as ${client.user.tag}`);
    const server = client.guilds.cache.get(config_1.SERVER_ID);
    if (!server)
        return;
    const her = yield (0, findMemberFunctions_1.findTheOne)(server);
    //const father = await findFather(server);
    reminder.remindHer(her, 1);
    /*
    Message cache cleaner
    if the server becomes much more active the clearout condition should be changed
    eg keep the most recent spam detection in some variable and clear the cache if it's more than 5 minutes old
    or something like that
    */
    setInterval(() => {
        if (messages.length && Date.now() - messages[messages.length - 1].createdTimestamp > 1000 * 60 * 5) {
            messages.length = 0;
            console.log("Cleaned out messages cache...");
        }
    }, 1000 * 60 * 15);
    /* await checkMemberRoles(server); */ //lola gör den själv
}));
client.login(config_1.TOKEN);
//raid warning system
client.on("guildMemberAdd", (member) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${member.displayName} just joined`);
    const guild = member.guild;
    const now = Date.now();
    joins.push(now);
    while (joins.length && now - joins[0] > 30000) {
        console.log(joins);
        joins.shift();
    }
    ;
    if (joins.length > 0) {
        console.log("Just confirming the raid detector works... ", `Joins in last 30 seconds: ${joins.length}...`);
    }
    ;
    if (joins.length >= 10) {
        const mods = yield (0, findMemberFunctions_1.findMods)(guild);
        for (const mod of mods) {
            try {
                yield mod.send("Possible raid detected; 10 or more people joined within last 30 seconds");
            }
            catch (_a) {
                console.log(`Failed to DM ${mod}`);
            }
            ;
        }
        ;
    }
    ;
    if (joins.length >= 25) {
        //konsultera lola
    }
    ;
    if (joins.length >= 50) {
        //konsultera lola
    }
    ;
}));
//spam detector
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    messages.push(message);
    const userId = message.author.id;
    const usersMsgs = messages.filter(msg => msg.author.id === userId);
    if (usersMsgs.length === 1)
        return;
    const latest = usersMsgs[usersMsgs.length - 1];
    const penultimate = usersMsgs[usersMsgs.length - 2];
    if (latest.createdTimestamp - penultimate.createdTimestamp < 500) {
        console.log(`Suspiciously fast message sent by ${message.author.displayName}; delay: ${latest.createdTimestamp - penultimate.createdTimestamp} milliseconds`);
        if (latest.content.length > 10 && latest.content === penultimate.content) {
            //konsultera lola om vad som bör ske
        }
        ;
    }
    ;
}));
client.on("messageCreate", (message) => {
    if (message.guild)
        return;
    if (message.author.id != config_1.AMY_ID)
        return;
    if (message.content === "STOP") {
        message.reply("Oki I'll stop. If you ever want me to start again, just dm me START");
        reminder.stopBothering();
    }
    ;
    if (message.content === "START") {
        message.reply("Oki I'll start again");
        reminder.startAgain(client);
    }
    ;
    if (message.content.includes("isn't that right")) {
        message.reply("That's right!");
    }
    ;
});
