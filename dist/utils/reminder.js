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
const reminders_json_1 = require("../../reminders.json");
const randomTime_1 = require("./randomTime");
const config_1 = require("../config");
const reminderCounter = {};
reminders_json_1.reminders.forEach(reminder => {
    reminderCounter[reminder] = 1;
});
const messageGenerator = () => {
    const randomNum = Math.floor(Math.random() * reminders_json_1.reminders.length);
    const reminder = reminders_json_1.reminders[randomNum];
    return {
        count: reminder,
        //my indentation looks like this so that hers can look like this
        message: `${reminder}

${reminderCounter[reminder] > 1 ? `I have reminded you of this ${reminderCounter[reminder]} times since I was last rebooted and will keep doing it until you understand it yourself
If you want me to stop just dm me "stop"` : ""}
`
    };
};
class ReminderManager {
    constructor() {
        this.botherHer = true;
        this.counter = 1;
        this.remindHer = (her) => __awaiter(this, void 0, void 0, function* () {
            const time = (0, randomTime_1.randomInterval)();
            if (this.botherHer) {
                const { message, count } = messageGenerator();
                yield her.send(message);
                console.log("Reminder sent: " + message);
                reminderCounter[count]++;
            }
            ;
            this.counter++;
            console.log(her.displayName);
            console.log("Current time is " + (new Date().toLocaleString()) + ", next reminder to be sent in approximately " + (time / 1000 / 60 / 60).toPrecision(4) + " hours");
            setTimeout(() => { this.remindHer(her); }, time);
        });
        this.stopBothering = () => {
            this.botherHer = false;
        };
        this.startAgain = (client) => __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const server = client.guilds.cache.get(config_1.SERVER_ID);
                yield (server === null || server === void 0 ? void 0 : server.members.fetch());
                let her;
                her = server === null || server === void 0 ? void 0 : server.members.cache.get(config_1.AMY_ID);
                if (!her) {
                    her = server === null || server === void 0 ? void 0 : server.members.cache.get(config_1.LOLAPAZ_ID);
                }
                ;
                const { message, count } = messageGenerator();
                yield (her === null || her === void 0 ? void 0 : her.send(message));
                reminderCounter[count]++;
            }), 2500);
            this.botherHer = true;
        });
    }
}
;
exports.default = new ReminderManager();
