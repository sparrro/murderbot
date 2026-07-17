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
class ReminderManager {
    constructor() {
        this.botherHer = true;
        this.remindHer = (her, i) => __awaiter(this, void 0, void 0, function* () {
            if (this.botherHer) {
                yield her.send(String(i));
                i++;
                setTimeout(() => { this.remindHer(her, i); }, 1000 * 2);
            }
            else {
                setTimeout(() => { this.remindHer(her, i); }, 1000 * 2);
            }
        });
        this.stopBothering = () => {
            this.botherHer = false;
        };
        this.startAgain = () => {
            this.botherHer = true;
        };
    }
}
;
module.exports = new ReminderManager();
