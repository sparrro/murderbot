import { Client, Guild, GuildMember } from "discord.js"
import { reminders } from "../../reminders.json";
import { randomInterval } from "./randomTime";
import { AMY_ID, LOLAPAZ_ID, SERVER_ID } from "../config";
import { findTheOne } from "./findMemberFunctions";

const reminderCounter: Record<string, number> = {};
reminders.forEach(reminder => {
    reminderCounter[reminder] = 1;
});

const messageGenerator = () => {
    const randomNum = Math.floor(Math.random() * reminders.length);
    const reminder = reminders[randomNum];
    return {
        count: reminder,
        //my indentation looks like this so that hers can look like this
        message: `${reminder}

${reminderCounter[reminder] > 1 ? `I have reminded you of this ${reminderCounter[reminder]} times since I was last rebooted and will keep doing it until you understand it yourself
If you want me to stop just dm me "stop"` : ""}
`
    }
};

class ReminderManager {
    botherHer = true;
    counter = 1;
    remindHer = async (server: Guild) => {
        const time = randomInterval();
        if (this.botherHer) {
            const { message, count } = messageGenerator();
            await server.members.fetch();
            let her: GuildMember | undefined;
            console.log("Attempting to find her main account...");
            her = server.members.cache.get(AMY_ID!);
            if (!her) {
                console.log("Failed to find her main account, attempting to find her other account...");
                her = server.members.cache.get(LOLAPAZ_ID!);
            };
            if (her) {
                console.log(`Account found: ${her.displayName}`);
                await her.send(message);
                console.log("Reminder sent: " + message);
                reminderCounter[count]++;
            } else {
                console.log(`Failed to find either of her accounts`);
            };
        };
        this.counter++;
        console.log("Current time is " + (new Date().toLocaleString()) + ", next reminder to be sent in approximately " + (time / 1000 / 60 / 60).toPrecision(4) + " hours")
        setTimeout(() => { this.remindHer(server) }, time);
    };
    stopBothering = () => {
        this.botherHer = false;
    };
    startAgain = async (client: Client) => {
        setTimeout(async () => { //timeout to dodge rate limiting
            const server = client.guilds.cache.get(SERVER_ID!);
            await server?.members.fetch();
            let her: GuildMember | undefined;
            her = server?.members.cache.get(AMY_ID!);
            if (!her) {
                her = server?.members.cache.get(LOLAPAZ_ID!);
            };
            const { message, count } = messageGenerator();
            await her?.send(message);
            reminderCounter[count]++;
        }, 15000);
        this.botherHer = true;
    };
};

export default new ReminderManager();