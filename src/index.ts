import { TOKEN, SERVER_ID, LOLAPAZ_ID, MY_ID } from "./config"; 
import { Client, GatewayIntentBits, Message, OmitPartialGroupDMChannel } from "discord.js";
import {
    findMods,
    findAllMembers,
    findByUsername,
    findTheOne,
    findFather
 } from "./utils/findMemberFunctions";
import { checkMemberRoles } from "./utils/checkMemberRoles";
import { randomInterval } from "./utils/randomTime";
const reminder = require("./utils/reminder")

//cache
const messages: OmitPartialGroupDMChannel<Message<boolean>>[] = [];
const joins: number[] = [];

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

client.once("clientReady", async () => {
    console.log(`Logged in as ${client.user!.tag}`);

    const server = client.guilds.cache.get(SERVER_ID!);
    if (!server) return;

    const her = await findTheOne(server);
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
            //konsultera lola om vad som bör ske
        };
    };

});

client.on("messageCreate", (message) => {
    if (message.guild) return;
    if (message.author.id != MY_ID) return;
    if (message.content === "STOP") {
        message.reply("Oki I'll stop. If you ever want me to start again, just dm me START");
        reminder.stopBothering();
    };
    if (message.content === "START") {
        message.reply("Oki I'll start again");
        reminder.startAgain(client);
    };
    if (message.content.includes("isn't that right")) {
        message.reply("That's right!");
    };
});