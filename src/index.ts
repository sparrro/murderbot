import { TOKEN } from "./config"; 
import { Client, GatewayIntentBits, Message, OmitPartialGroupDMChannel } from "discord.js";
import { findMods } from "./utils/findMemberFunctions";

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.once("clientReady", () => {
    console.log(`Logged in as ${client.user!.tag}`);
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

//raid warning system
const joins: number[] = [];
client.on("guildMemberAdd", async member => {

    const guild = member.guild;

    const now = Date.now();
    joins.push(now);

    while (joins.length && now - joins[0] > 30000) {
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
const messages: OmitPartialGroupDMChannel<Message<boolean>>[] = []
client.on("messageCreate", message => {
    if (message.author.bot) return;

    console.log(`Message sent by ${message.author.displayName}: ${message.content}`);

    messages.push(message); //if the bot is going to be run 24/7 from some cloud service, make it clean this up every now and then

    const userId = message.author.id;
    const usersMsgs = messages.filter(msg =>
        msg.author.id === userId
    );

    if (usersMsgs.length === 1) return;

    if (usersMsgs[usersMsgs.length - 1].createdTimestamp - usersMsgs[usersMsgs.length - 2].createdTimestamp < 1000) {
        console.log(`Suspiciously fast message sent by ${message.author.displayName}`);
    }

});

//meddela nya medlemmar om att de behöver en geografisk roll

//sparka medlemmar som inte har en geografisk roll 24 timmar efter att de gick med