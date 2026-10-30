import { TOKEN, SERVER_ID, MY_ID, AMY_ID, GLOO_ID, LYKOPHOS_ID, NAMIRE_ID, TEEMOTHEE_ID, QATARI_ID, MODROLE_ID, LOLAPAZ_ID, HATERS_ID, CASPIAN_ID, MURKY_ID, ENEMY_ID, QUEZEL_ID, GENERAL_CHANNEL_ID, DUNGEON_CHANNEL_ID, BOTCHI_ID, ART_ID, MODLOG_CHANNEL_ID } from "./config"; 
import { Client, DMChannel, GatewayIntentBits, GuildMember, Message, MessageType, OmitPartialGroupDMChannel, TextChannel } from "discord.js";
import {
    findMods,
} from "./utils/findMemberFunctions";
import reminder from "./utils/reminder";
import { banUser, demoteModerator, kickUser } from "./utils/weapons";
import { generalWiper } from "./utils/generalWiper";

//cache
const messages: OmitPartialGroupDMChannel<Message<boolean>>[] = [];
const joins: number[] = [];

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions
    ],
});

client.once("clientReady", async () => {
    console.log(`Logged in as ${client.user!.tag}`);

    const server = client.guilds.cache.get(SERVER_ID!);
    if (!server) {
        console.log("Couldn't find the server");
        return;
    };


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

    const dungeon = server.channels.cache.get(DUNGEON_CHANNEL_ID!) as TextChannel;
    if (!dungeon) {
        console.log("Couldn't find the dungeon");
    } else {
        await dungeon.messages.fetch();
        const botchiMsgs = dungeon.messages.cache.filter(message => message.author.id == BOTCHI_ID);
        if (botchiMsgs.size > 0) {
            botchiMsgs.delete(botchiMsgs.firstKey()!);
            await dungeon.bulkDelete(botchiMsgs);
            console.log("Shut up Botchi");
        };
    };

    await server.members.fetch();
    const father = server.members.cache.get(MY_ID!);
    await father?.send("I'm online");

    setTimeout(async () => {
        await reminder.remindHer(server);
    }, 30000);

    setTimeout(async () => generalWiper(server), 1000 * 10);

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

    setInterval(async () => {
        await father?.send("Don't forget to renew my hosting!");
    }, 1000 * 60 * 60 * 24 * 2);

    /* await checkMemberRoles(server); */ //lola gör den själv

});

client.login(TOKEN);

//raid warning system
client.on("guildMemberAdd", async (member) => {

    console.log(`${member.displayName} just joined`);

    const guild = member.guild;

    const now = Date.now();
    joins.push(now);

    while (joins.length && now - joins[0] > 30000) {
        console.log(joins);
        joins.shift();
    };

    if (joins.length > 0) {
        console.log("Just confirming the raid detector works... ", `Joins in last 30 seconds: ${joins.length}...`);
    };

    if (joins.length >= 10) {
        const mods = await findMods(guild);

        for (const mod of mods) {
            try {
                await mod.send("Possible raid detected; 10 or more people joined within last 30 seconds");
            } catch {
                console.log(`Failed to DM ${mod}`);
            };
        };
    };

    if (joins.length >= 25) {
        //konsultera lola
    };

    if (joins.length >= 50) {
        //konsultera lola
    };

});

//spam detector
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    messages.push(message);

    const userId = message.author.id;
    const usersMsgs = messages.filter(msg => msg.author.id === userId);

    if (usersMsgs.length === 1) return;

    const latest = usersMsgs[usersMsgs.length - 1];
    const penultimate = usersMsgs[usersMsgs.length - 2];

    if (latest.createdTimestamp - penultimate.createdTimestamp < 500) {
        console.log(`Suspiciously fast message sent by ${message.author.displayName}; delay: ${latest.createdTimestamp - penultimate.createdTimestamp} milliseconds`);
        if (latest.content.length > 10 && latest.content === penultimate.content) {
            const member = message.guild?.members.cache.get(message.author.id);
            if (!member) {
                console.log("Failed to find " + message.author.displayName + " in order to kick them for spamming");
                return;
            };
            await kickUser(member, "Spam");
            //konsultera lola om vad som bör ske
        };
    };

});

client.on("messageCreate", (message) => {
    if (message.guild) return;
    if (!(message.author.id == AMY_ID || message.author.id == LOLAPAZ_ID)) return;
    if (message.content.toLowerCase() === "stop") {
        message.reply(`Oki I'll stop. If you ever want me to start again, just dm me "start"`);
        reminder.stopBothering();
    };
    if (message.content.toLowerCase() === "start") {
        message.reply("Oki I'll start again");
        reminder.startAgain(client);
    };
});

client.on("messageCreate", async (message) => {
    if (message.guild) return;
    if (message.author.id != MY_ID) return;
    await client.guilds.fetch();
    const server = client.guilds.cache.get(SERVER_ID!);
    if (!server) {
        console.log("Couldn't find server");
        return;
    };
    if (message.content.toLowerCase().includes("demote")) {
        let id: string | undefined;
        if (message.content.toLowerCase().includes("gloo")) {
            id = GLOO_ID!;
        } else if (message.content.toLowerCase().includes("lyko")) {
            id = LYKOPHOS_ID!;
        } else if (message.content.toLowerCase().includes("namire")) {
            id = NAMIRE_ID!;
        } else if (message.content.toLowerCase().includes("teem")) {
            id = TEEMOTHEE_ID!;
        } else if (message.content.toLocaleLowerCase().includes("hate")) {
            id = HATERS_ID;
        } else if (message.content.toLocaleLowerCase().includes("casp")) {
            id = CASPIAN_ID;
        } else if (message.content.toLowerCase().includes("murk")) {
            id = MURKY_ID;
        } else if (message.content.toLowerCase().includes("quezel")) {
            id = QUEZEL_ID;
        };
        if (!id) return;
        const mod = server.members.cache.get(id);
        console.log(mod?.displayName + " demoted")
        await demoteModerator(mod!, server);
    };
});

client.on("messageCreate", async (message) => {
    if (message.author.id == ENEMY_ID) {
        console.log("The enemy just posted");
        console.log(message.content);
        if (message.type == MessageType.UserJoin) {
            console.log("She just rejoined, false alarm");
            return;
        };
        if (message.content.length == 0) return;
        const server = client.guilds.cache.get(SERVER_ID!);
        const enemy = server!.members.cache.get(ENEMY_ID);
        if (enemy) {
            await kickUser(enemy, "I told you not to chat in here");
            console.log("Got her ass");
        } else {
            console.log("She's not here anymore, Bocchi must have beat me to it");
        };
    };
});

let keepAnEyeOnHer = false;

client.on("messageCreate", async (message) => {
    if (message.author.id != MY_ID) return;
    if (message.content.toLowerCase().includes("toggle surveillance")) {
        keepAnEyeOnHer = !keepAnEyeOnHer;
        const server = client.guilds.cache.get(SERVER_ID!);
        const father = server?.members.cache.get(MY_ID!);
        await father?.send(keepAnEyeOnHer ? "I'll keep an eye on her" : "I'll leave her be for now");
    };
});

client.on("messageReactionAdd", async (reaction) => {
    if (reaction.users.cache.get(ENEMY_ID!)) {
        const server = client.guilds.cache.get(SERVER_ID!);
        const father = server?.members.cache.get(MY_ID!);
        await father?.send(`The enemy just reacted to "${reaction.message}" by ${reaction.message.author?.displayName} with ${reaction.emoji}`)
    };
});

client.on("messageCreate", async (message) => {
    if (message.author.id != LOLAPAZ_ID) return;
    if (!keepAnEyeOnHer) return;
    const server = client.guilds.cache.get(SERVER_ID!);
    const father = server!.members.cache.get(MY_ID!);
    await father?.send({
        content: message.content
    });
});

client.on("messageCreate", async (message) => {
    if (message.author.id != MY_ID) return;
    if (message.content != "test joinedat") return;
    console.log("message received")
    
    setTimeout(async () => {
        const server = client.guilds.cache.get(SERVER_ID!);
        const me = (await server?.members.fetch())?.get(MY_ID!);
        me ? console.log(me.joinedAt, me.joinedTimestamp) : console.log("Couldn't find me");
        await message.reply(`You joined at ${me?.joinedAt?.toLocaleTimeString()} o'clock, ${me?.joinedAt?.toLocaleDateString()}`)
    }, 1000 * 30);
    return;
});

client.on("guildMemberRemove", async (leaver) => {
    const server = client.guilds.cache.get(SERVER_ID!);
    const modLog = (await server?.channels.fetch())?.get(MODLOG_CHANNEL_ID!) as TextChannel | null | undefined;
    if (!modLog) {
        console.log("Couldn't find the moderation log");
        return;
    };
    await modLog.send(`${leaver.user.displayName} left, who joined at ${leaver.joinedAt?.toLocaleDateString()}`);
});

client.on("guildMemberAdd", async (member) => {
    if (member.id === QATARI_ID) {
        await banUser(member, "You're not welcome back unless you apologise to Lola first");
    };
});