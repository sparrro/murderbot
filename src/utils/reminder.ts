import { GuildMember } from "discord.js"

class ReminderManager {
    botherHer = true;
    remindHer = async (her: GuildMember, i: number) => {
        if (this.botherHer) {
            await her.send(String(i));
            i++
            setTimeout(() => {this.remindHer(her, i)}, 1000 * 2);
        } else {
            setTimeout(() => {this.remindHer(her, i)}, 1000 * 2);
        }
    };
    stopBothering = () => {
        this.botherHer = false;
    };
    startAgain = () => {
        this.botherHer = true;
    };
};

module.exports = new ReminderManager();