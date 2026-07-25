import { Client, GuildMember } from "discord.js"
import { reminders } from "../../reminders.json";
import { randomInterval } from "./randomTime";
import { SERVER_ID } from "../config";
import { findFather, findTheOne } from "./findMemberFunctions";

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
If you want me to stop just dm me STOP` : ""}
`
    }
};

class ReminderManager {
    botherHer = true;
    counter = 1;
    remindHer = async (her: GuildMember) => {
        const time = randomInterval();
        if (this.botherHer) {
            const { message, count } = messageGenerator();
            await her.send(message);
            console.log("Reminder sent: " + message);
            reminderCounter[count]++;
        };
        this.counter++;
        console.log("Current time is " + (new Date().toLocaleString()) + ", next reminder to be sent in approximately " + (time / 1000 / 60 / 60).toPrecision(4) + " hours")
        setTimeout(() => { this.remindHer(her) }, time);
    };
    stopBothering = () => {
        this.botherHer = false;
    };
    startAgain = async (client: Client) => {
        setTimeout(async () => { //timeout to dodge rate limiting
            const server = client.guilds.cache.get(SERVER_ID!);
            const her = await findTheOne(server!);
            const { message, count } = messageGenerator();
            await her?.send(message);
            reminderCounter[count]++;
        }, 2500);
        this.botherHer = true;
    };
};

export default new ReminderManager();