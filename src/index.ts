import { TOKEN, SERVER_ID } from "./config"; 
import { Client, GatewayIntentBits, Message, OmitPartialGroupDMChannel } from "discord.js";
import {
    findMods,
    findAllMembers
 } from "./utils/findMemberFunctions";
import { checkMemberRoles } from "./utils/checkMemberRoles";

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("clientReady", async () => {
    console.log(`Logged in as ${client.user!.tag}`);

    const server = client.guilds.cache.get(SERVER_ID!);
    if (!server) return;

    //await checkMemberRoles(server);

});

client.login(TOKEN)

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
const joins: number[] = [];
//clear out global arrays every now and then
setInterval(() => {
    if (joins.length && Date.now() - joins[joins.length] - 1 > 1000 * 60 * 5) {
        joins.length = 0
    }
}, 1000 * 60 * 15);
client.on("guildMemberAdd", async member => {

    console.log(`${member.displayName} just joined`)

    const guild = member.guild;

    const now = Date.now();
    joins.push(now);

    while (joins.length && now - joins[0] > 30000) {
        console.log(joins)
        joins.shift();
    }

    if (joins.length >= 10) {
        const mods = await findMods(guild);

        for (const mod of mods.values()) {
            try {
                await mod.send("Possible raid detected; 10 or more people joined within last 30 seconds")
            } catch {
                console.log(`Failed to DM ${mod}`)
            }
        }
    }

    if (joins.length >= 25) {
        //gör något mer drastiskt?
    }

    if (joins.length >= 50) {
        //sätt servern i karantän och skicka mig en lista över de senaste 50 medlemmarna som gick med
    }

});

//spam detector
const messages: OmitPartialGroupDMChannel<Message<boolean>>[] = [];
setInterval(() => {
    if (messages.length && Date.now() - messages[messages.length - 1].createdTimestamp > 1000 * 60 * 5) {
        messages.length = 0
    }
}, 1000 * 60 * 15);
client.on("messageCreate", async message => {
    if (message.author.bot) return;

    messages.push(message);

    const userId = message.author.id;
    const usersMsgs = messages.filter(msg =>
        msg.author.id === userId
    );

    if (usersMsgs.length === 1) return;

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
           message.author.send(`You sent two messages in ${usersMsgs[usersMsgs.length - 1].createdTimestamp - usersMsgs[usersMsgs.length - 2].createdTimestamp} milliseconds`)
        }
        try {
            await message.author.send("That's some fast typing there")
        } catch {
            console.log(`Failed to dm ${message.author.displayName}`)
        }
    }

});

//meddela nya medlemmar om att de behöver en geografisk roll

//sparka medlemmar som inte har en geografisk roll 24 timmar efter att de gick med