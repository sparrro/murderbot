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
client.once("clientReady", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Logged in as ${client.user.tag}`);
    const server = client.guilds.cache.get(config_1.SERVER_ID);
    if (!server)
        return;
    const father = yield (0, findMemberFunctions_1.findByUsername)(server, "sparrrrro");
    if (!father) {
        console.log("Elohi, Elohi, Lama sabachthani?");
    }
    else {
        father.send("Find you by username");
    }
    //await checkMemberRoles(server);
}));
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
/* client.on("raw", packet => {
    console.log("Raw event: " + packet.t)
}) */
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
    if (joins.length > 0) {
        console.log("Just confirming the raid detector works... ", `Joins in last 30 seconds: ${joins.length}...`);
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
let cacheCleaningIterator = 0;
setInterval(() => {
    cacheCleaningIterator++;
    console.log("Cache cleaned out" + cacheCleaningIterator + "times");
    if (messages.length && Date.now() - messages[messages.length - 1].createdTimestamp > 1000 * 60 * 5) {
        messages.length = 0;
        console.log("Cleaned out messages cache...");
    }
}, 1000 * 60 * 15);
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    messages.push(message);
    const userId = message.author.id;
    const usersMsgs = messages.filter(msg => msg.author.id === userId);
    if (usersMsgs.length === 1)
        return;
    if (usersMsgs[usersMsgs.length - 1].createdTimestamp - usersMsgs[usersMsgs.length - 2].createdTimestamp < 500) {
        console.log(`Suspiciously fast message sent by ${message.author.displayName}`);
        if (usersMsgs[usersMsgs.length - 1].content === usersMsgs[usersMsgs.length - 2].content) {
            /* for (const msg of usersMsgs) {
                if (msg.content === usersMsgs[usersMsgs.length - 1].content) {
                    try {
                        await msg.delete();
                    } catch {
                        console.log(`Failed to delete message ${msg.content} by ${msg.author.displayName}, a presumed spam bot account`)
                    }
                }
            }
            try {
                await message.member?.kick("Compromised account, get two factor authentication before rejoining");
            } catch {
                const mods = await findMods(message.guild!);
                for (const mod of mods.values()) {
                    try {
                        await mod.send(`I think ${message.author.displayName}'s account has been compromised but I was unable to kick them`)
                    } catch {
                        console.log(`Failed to dm ${mod.displayName}`);
                    }
                }
            } */
            //message.author.send(`You sent two messages in ${usersMsgs[usersMsgs.length - 1].createdTimestamp - usersMsgs[usersMsgs.length - 2].createdTimestamp} milliseconds`)
        }
        try {
            //await message.author.send("That's some fast typing there")
        }
        catch (_a) {
            console.log(`Failed to dm ${message.author.displayName}`);
        }
    }
}));
//meddela nya medlemmar om att de behöver en geografisk roll
//sparka medlemmar som inte har en geografisk roll 24 timmar efter att de gick med
