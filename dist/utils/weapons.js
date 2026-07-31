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
exports.banUser = exports.kickUser = exports.demoteModerator = exports.quarantineUserAndAlertMods = void 0;
const findMemberFunctions_1 = require("./findMemberFunctions");
const config_1 = require("../config");
const quarantineUserAndAlertMods = (user, message) => __awaiter(void 0, void 0, void 0, function* () {
    const mods = yield (0, findMemberFunctions_1.findMods)(user.guild);
    const father = user.guild.members.cache.get(config_1.MY_ID);
    let timedOut;
    try {
        timedOut = (yield user.timeout(1000 * 60 * 60 * 24)).communicationDisabledUntilTimestamp;
    }
    catch (error) {
        console.log(error);
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
            catch (error) {
                console.log(error);
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
const demoteModerator = (user, server) => __awaiter(void 0, void 0, void 0, function* () {
    const father = server.members.cache.get(config_1.MY_ID);
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
    catch (error) {
        console.log(error);
        const errorMsg = `Failed to demote ${user.displayName}`;
        console.log(errorMsg);
        yield (father === null || father === void 0 ? void 0 : father.send(errorMsg));
    }
    ;
});
exports.demoteModerator = demoteModerator;
const kickUser = (user, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const father = user.guild.members.cache.get(config_1.MY_ID);
    try {
        yield user.kick(reason);
    }
    catch (error) {
        console.log(error);
        const errorMsg = `Failed to kick ${user.displayName} for ${reason}`;
        console.log(errorMsg);
        yield (father === null || father === void 0 ? void 0 : father.send(errorMsg));
    }
    ;
});
exports.kickUser = kickUser;
const banUser = (user, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const father = user.guild.members.cache.get(config_1.MY_ID);
    try {
        yield user.ban({
            reason: reason
        });
    }
    catch (error) {
        console.log(error);
        const errorMsg = `Failed to ban ${user.displayName} for ${reason}`;
        console.log(errorMsg);
        yield (father === null || father === void 0 ? void 0 : father.send(errorMsg));
    }
    ;
});
exports.banUser = banUser;
//to add: demote all but trusted moderators; quarantine whole server
