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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const discord_js_1 = require("discord.js");
const findMemberFunctions_1 = require("./utils/findMemberFunctions");
const reminder_1 = __importDefault(require("./utils/reminder"));
const weapons_1 = require("./utils/weapons");
const generalWiper_1 = require("./utils/generalWiper");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const formatTime_1 = require("./utils/formatTime");
const list_json_1 = __importDefault(require("../assets/list.json"));
//cache
const messages = [];
const joins = [];
const reminded = [];
let assignMemberRole = false;
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        discord_js_1.Partials.Message,
        discord_js_1.Partials.Channel,
        discord_js_1.Partials.Reaction
    ]
});
client.once("clientReady", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Logged in as ${client.user.tag}`);
    const server = client.guilds.cache.get(config_1.SERVER_ID);
    if (!server) {
        console.log("Couldn't find the server");
        return;
    }
    ;
    /* reminder.remindHer(server);

    await server.members.fetch();

    let her: GuildMember | undefined;

    her = server.members.cache.get(AMY_ID!);

    if (!her) {
        her = server.members.cache.get(LOLAPAZ_ID!);
    };

    if (her) {
        reminder.remindHer(her);
    }; */
    const dungeon = server.channels.cache.get(config_1.DUNGEON_CHANNEL_ID);
    if (!dungeon) {
        console.log("Couldn't find the dungeon");
    }
    else {
        yield dungeon.messages.fetch();
        const botchiMsgs = dungeon.messages.cache.filter(message => message.author.id == config_1.BOTCHI_ID);
        if (botchiMsgs.size > 0) {
            botchiMsgs.delete(botchiMsgs.firstKey());
            yield dungeon.bulkDelete(botchiMsgs);
            console.log("Shut up Botchi");
        }
        ;
    }
    ;
    yield server.members.fetch();
    const father = server.members.cache.get(config_1.MY_ID);
    yield (father === null || father === void 0 ? void 0 : father.send("I'm online"));
    /* setTimeout(async () => {
        await reminder.remindHer(server);
    }, 30000); */
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { return (0, generalWiper_1.generalWiper)(server); }), 1000 * 10);
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
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (father === null || father === void 0 ? void 0 : father.send("Don't forget to renew my hosting!"));
    }), 1000 * 60 * 60 * 24 * 2);
    setInterval(() => {
        console.log("It is currently " + (0, moment_timezone_1.default)(Date.now()).tz("Europe/Stockholm").format("YYYY-MM-DD HH:mm"));
    }, 1000 * 60 * 60);
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
    var _a;
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
            const member = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(message.author.id);
            if (!member) {
                console.log("Failed to find " + message.author.displayName + " in order to kick them for spamming");
                return;
            }
            ;
            yield (0, weapons_1.kickUser)(member, "Spam");
            //konsultera lola om vad som bör ske
        }
        ;
    }
    ;
}));
client.on("messageCreate", (message) => {
    if (message.guild)
        return;
    if (!(message.author.id == config_1.AMY_ID || message.author.id == config_1.LOLAPAZ_ID))
        return;
    if (message.content.toLowerCase() === "stop") {
        message.reply(`Oki I'll stop. If you ever want me to start again, just dm me "start"`);
        reminder_1.default.stopBothering();
    }
    ;
    if (message.content.toLowerCase() === "start") {
        message.reply("Oki I'll start again");
        reminder_1.default.startAgain(client);
    }
    ;
});
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.guild)
        return;
    if (message.author.id != config_1.MY_ID)
        return;
    yield client.guilds.fetch();
    const server = client.guilds.cache.get(config_1.SERVER_ID);
    if (!server) {
        console.log("Couldn't find server");
        return;
    }
    ;
    if (message.content.toLowerCase().includes("demote")) {
        let id;
        if (message.content.toLowerCase().includes("gloo")) {
            id = config_1.GLOO_ID;
        }
        else if (message.content.toLowerCase().includes("lyko")) {
            id = config_1.LYKOPHOS_ID;
        }
        else if (message.content.toLowerCase().includes("namire")) {
            id = config_1.NAMIRE_ID;
        }
        else if (message.content.toLowerCase().includes("teem")) {
            id = config_1.TEEMOTHEE_ID;
        }
        else if (message.content.toLocaleLowerCase().includes("hate")) {
            id = config_1.HATERS_ID;
        }
        else if (message.content.toLocaleLowerCase().includes("casp")) {
            id = config_1.CASPIAN_ID;
        }
        else if (message.content.toLowerCase().includes("murk")) {
            id = config_1.MURKY_ID;
        }
        else if (message.content.toLowerCase().includes("quezel")) {
            id = config_1.QUEZEL_ID;
        }
        ;
        if (!id)
            return;
        const mod = server.members.cache.get(id);
        console.log((mod === null || mod === void 0 ? void 0 : mod.displayName) + " demoted");
        yield (0, weapons_1.demoteModerator)(mod, server);
    }
    ;
}));
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.id == config_1.ENEMY_ID) {
        console.log("The enemy just posted");
        console.log(message.content);
        if (message.type == discord_js_1.MessageType.UserJoin) {
            console.log("She just rejoined, false alarm");
            return;
        }
        ;
        if (message.content.length == 0)
            return;
        const server = client.guilds.cache.get(config_1.SERVER_ID);
        const enemy = server.members.cache.get(config_1.ENEMY_ID);
        if (enemy) {
            yield (0, weapons_1.kickUser)(enemy, "I told you not to chat in here");
            console.log("Got her ass");
        }
        else {
            console.log("She's not here anymore, Bocchi must have beat me to it");
        }
        ;
    }
    ;
}));
let keepAnEyeOnHer = false;
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.id != config_1.MY_ID)
        return;
    if (message.content.toLowerCase().includes("toggle surveillance")) {
        keepAnEyeOnHer = !keepAnEyeOnHer;
        const server = client.guilds.cache.get(config_1.SERVER_ID);
        const father = server === null || server === void 0 ? void 0 : server.members.cache.get(config_1.MY_ID);
        yield (father === null || father === void 0 ? void 0 : father.send(keepAnEyeOnHer ? "I'll keep an eye on her" : "I'll leave her be for now"));
    }
    ;
}));
client.on("messageReactionAdd", (reaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (reaction.users.cache.get(config_1.ENEMY_ID)) {
        const server = client.guilds.cache.get(config_1.SERVER_ID);
        const father = server === null || server === void 0 ? void 0 : server.members.cache.get(config_1.MY_ID);
        yield (father === null || father === void 0 ? void 0 : father.send(`The enemy just reacted to "${reaction.message}" by ${(_a = reaction.message.author) === null || _a === void 0 ? void 0 : _a.displayName} with ${reaction.emoji}`));
    }
    ;
}));
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.id != config_1.LOLAPAZ_ID)
        return;
    if (!keepAnEyeOnHer)
        return;
    const server = client.guilds.cache.get(config_1.SERVER_ID);
    const father = server.members.cache.get(config_1.MY_ID);
    yield (father === null || father === void 0 ? void 0 : father.send({
        content: message.content
    }));
}));
client.on("guildMemberRemove", (leaver) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const server = client.guilds.cache.get(config_1.SERVER_ID);
    const modLog = (_a = (yield (server === null || server === void 0 ? void 0 : server.channels.fetch()))) === null || _a === void 0 ? void 0 : _a.get(config_1.MODLOG_CHANNEL_ID);
    if (!modLog) {
        console.log("Couldn't find the moderation log");
        return;
    }
    ;
    const date = (0, moment_timezone_1.default)(leaver.joinedAt).tz("America/Vancouver").format("YYYY-MM-DD HH:mm");
    const difference = Date.now() - leaver.joinedTimestamp;
    const timeSpent = (0, formatTime_1.formatTime)(difference);
    yield modLog.send(`<@${leaver.user.id}> (${leaver.user.displayName}, id ${leaver.user.id}) left\nThey joined at ${date} (here for ${timeSpent})`);
}));
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.id != config_1.BOTCHI_ID)
        return;
    if (message.channel.id != config_1.DUNGEON_CHANNEL_ID)
        return;
    yield message.delete();
    console.log("Shut up Bocchi I'm gonna fuck you in the ass with my sheet metal cock");
    return;
}));
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.id != config_1.AMY_ID)
        return;
    if (message.channel.id == config_1.MODLOG_CHANNEL_ID)
        return;
    yield message.delete();
    yield message.author.send("You're on your private account dummy!");
}));
/* client.on("messageCreate", async (message) => { //get rid of this and just do the on join individual ones
    if (message.guild) return;
    if (message.author.id != LOLAPAZ_ID && message.author.id != AMY_ID && message.author.id != MY_ID) return;
    if (!message.content.toLowerCase().includes("member role")) return;
    const reply = await message.author.send("Order received, I'll set to work reminding them...");
    let remindees = 0;
    const server = client.guilds.cache.get(SERVER_ID!);
    const members = await server?.members.fetch();
    if (!members) {
        console.log("Couldn't get member list");
        return;
    };
    for (const [, member] of members) {
        if (!member.roles.cache.has(MEMBER_ROLE_ID!) && !reminded.includes(member.id)) {
            try {
                await member.send("Hello there! I'm the head of security for Lola Paz's server\nI just wanted to let you know there's a lot more to the server than you can see upon joining\nYou can gain access to the rest of it by going to the 『♡』survey『♡』channel and answering some of the surveys to get the member role");
                reminded.push(member.id);
                remindees++;
            } catch {
                console.log(`Could not dm ${member.displayName}`);
            };
        };
    };
    await reply.edit(`Order received, I'll set to work reminding them...\nSent reminders to ${remindees} people\nAll done`);
    return;
}); */
client.on("guildMemberAdd", (member) => __awaiter(void 0, void 0, void 0, function* () {
    if (member.id === config_1.QATARI_ID) {
        yield (0, weapons_1.banUser)(member, "You're not welcome back unless you apologise to Lola first");
    }
    ;
}));
client.on("guildMemberAdd", (member) => __awaiter(void 0, void 0, void 0, function* () {
    const server = client.guilds.cache.get(config_1.SERVER_ID);
    yield server.channels.fetch();
    const generalChannel = server === null || server === void 0 ? void 0 : server.channels.cache.get(config_1.GENERAL_CHANNEL_ID);
    const modLog = server === null || server === void 0 ? void 0 : server.channels.cache.get(config_1.MODLOG_CHANNEL_ID);
    if (assignMemberRole) {
        yield member.roles.add(config_1.MEMBER_ROLE_ID);
        const { file, source } = list_json_1.default[Math.floor(Math.random() * list_json_1.default.length)];
        yield generalChannel.send({
            content: `Welcome <@${member.user.id}>\n` +
                `Source: ${source}`,
            files: [`assets/${file}`]
        });
        try {
            yield member.send("Welcome to Lola Paz's server!\n" +
                "There's more to the server than you can see upon joiningn" +
                `You get access to the rest of it by going to <#${config_1.SURVEY_CHANNEL_ID}> and answering some surveys\n` +
                "You should also read through the rules and get some roles in the roles channel once you have access to it\n" +
                "The bot responsible for the surveys is down at the moment so I assigned you the member role myself");
        }
        catch (_a) {
            yield modLog.send(`Couldn't send a welcome dm to <@${member.user.id}> (${member.displayName}, id ${member.user.id})`);
        }
        ;
    }
    else {
        try {
            yield member.send("Welcome to Lola Paz's server!\n" +
                "There's more to the server than you can see upon joiningn" +
                `You get access to the rest of it by going to <#${config_1.SURVEY_CHANNEL_ID}> and answering some surveys\n` +
                "You should also read through the rules and get some roles in the roles channel once you have access to it");
        }
        catch (_b) {
            yield modLog.send(`Couldn't send a welcome dm to <@${member.user.id}> (${member.displayName}, id ${member.user.id})`);
        }
        ;
    }
    ;
    return;
}));
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.guild)
        return;
    if (message.author.id != config_1.MY_ID && message.author.id != config_1.LOLAPAZ_ID && message.author.id != config_1.AMY_ID)
        return;
    if (message.content.toLowerCase().includes("member role")) {
        assignMemberRole = !assignMemberRole;
        try {
            if (assignMemberRole) {
                yield message.author.send("Understood, I'll assign the member role to new members");
            }
            else {
                yield message.author.send("Understood, I'll stop assigning the member role to new members");
            }
        }
        catch (_a) {
            console.log(`Couldn't dm ${message.author.displayName} about member role assignment`);
        }
    }
}));
client.on("messageReactionAdd", (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (reaction.message.id != config_1.REGION_ROLES_MESSAGE_ID)
        return;
    const server = client.guilds.cache.get(config_1.SERVER_ID);
    const member = (_a = server === null || server === void 0 ? void 0 : server.members.cache.get(user.id)) !== null && _a !== void 0 ? _a : yield (server === null || server === void 0 ? void 0 : server.members.fetch(user.id));
    console.log(member === null || member === void 0 ? void 0 : member.displayName);
    switch (reaction.emoji.name) {
        case "🫎": {
            yield (member === null || member === void 0 ? void 0 : member.roles.add(config_1.NORDIC_ROLE_ID));
            break;
        }
    }
    return;
}));
