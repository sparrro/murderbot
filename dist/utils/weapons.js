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
exports.demoteModerator = exports.quarantineUserAndAlertMods = void 0;
const findMemberFunctions_1 = require("./findMemberFunctions");
const config_1 = require("../config");
const quarantineUserAndAlertMods = (user, message) => __awaiter(void 0, void 0, void 0, function* () {
    const mods = yield (0, findMemberFunctions_1.findMods)(user.guild);
    const father = yield (0, findMemberFunctions_1.findFather)(user.guild);
    let timedOut;
    try {
        timedOut = (yield user.timeout(1000 * 60 * 60 * 24)).communicationDisabledUntilTimestamp;
    }
    catch (_a) {
        const errorMsg = `Failed to quarantine ${user.displayName}`;
        console.log(errorMsg);
        yield (father === null || father === void 0 ? void 0 : father.send(errorMsg));
    }
    ;
    if (timedOut) {
        for (const mod of mods) {
            try {
                yield mod.send(`I have put ${user.displayName} in quarantine because I believe their message ${message.content} was spam and would like a human moderator to make a final determination`);
            }
            catch (_b) {
                const errorMsg = `Failed to dm mod ${mod.displayName} regarding ${user.displayName} being quarantined`;
                console.log(errorMsg);
                yield (father === null || father === void 0 ? void 0 : father.send(errorMsg));
            }
            ;
        }
        ;
    }
    ;
});
exports.quarantineUserAndAlertMods = quarantineUserAndAlertMods;
const demoteModerator = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const father = yield (0, findMemberFunctions_1.findFather)(user.guild);
    const isModerator = user.roles.cache.some(role => role.id == config_1.MODROLE_ID);
    if (!isModerator) {
        const errorMsg = `${user.displayName} is already not a moderator`;
        console.log(errorMsg);
        yield (father === null || father === void 0 ? void 0 : father.send(errorMsg));
        return;
    }
    ;
    try {
        yield user.roles.remove(config_1.MODROLE_ID);
        const successMsg = `Demoted ${user.displayName}`;
        console.log(successMsg);
        yield (father === null || father === void 0 ? void 0 : father.send(successMsg));
    }
    catch (_a) {
        const errorMsg = `Failed to demote ${user.displayName}`;
        console.log(errorMsg);
        yield (father === null || father === void 0 ? void 0 : father.send(errorMsg));
    }
    ;
});
exports.demoteModerator = demoteModerator;
/* export const kickUser = async (user: GuildMember, reason: string) => {
    const father = await findFather(user.guild);
    try {
        await user.kick(reason);
    } catch {
        const errorMsg = `Failed to kick ${user.displayName} for ${reason}`;
        console.log(errorMsg);
        await father?.send(errorMsg);
    };
};

export const banUser = async (user: GuildMember, reason: string) => {
    const father = await findFather(user.guild);
    try {
        await user.ban({
            reason: reason
        });
    } catch {
        const errorMsg = `Failed to ban ${user.displayName} for ${reason}`;
        console.log(errorMsg);
        await father?.send(errorMsg);
    };
}; */
//to add: demote all but trusted moderators; quarantine whole server
