import { TOKEN } from "./config"; 
import { Client, GatewayIntentBits } from "discord.js";
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
client.on("messageCreate", message => {
    if (message.author.bot) return;

    //hitta alla meddelanden med samma författare i kronologisk ordning

    //kolla om de senaste två meddelandena hade mindre än en sekunds fördröjning

    //om de hade det, sätt användaren i karantän och meddela mig

})