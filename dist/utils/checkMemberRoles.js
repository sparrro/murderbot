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
exports.checkMemberRoles = void 0;
const findMemberFunctions_1 = require("./findMemberFunctions");
const geoRoles = new Set([
    "1517845436709339207", //North America
    "1517845442048561184", //Central America
    "1517845448470040576", //Caribbean
    "1517845453704790046", //South America
    "1517877606635012117", //Nordics
    "1517878025734197258", //Western Europe
    "1517878023431393350", //Southern Europe
    "1517878375195349063", //Eastern Europe
    "1517878393792626799", //Oceania
    "1517878390949023775", //North Africa
    "1517878392870142074", //Sub-Saharan Africa
    "1517878954441183313", //Middle East & West Asia
    "1517878957561610260", //Central Asia & Caucasus
    "1517878960749543464", //South Asia
    "1517878964251525250", //East Asia
    "1517879312710107276", //Southeast Asia
]);
const checkMemberRoles = (server) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield (0, findMemberFunctions_1.findAllMembers)(server);
    for (const member of members) {
        if (member.user.bot)
            continue;
        const hasGeoRole = member.roles.cache.some(role => geoRoles.has(role.id));
        if (hasGeoRole) {
            console.log(`${member.displayName} has a geographic role`);
        }
        else {
            const ageOfMembership = Date.now() - member.joinedTimestamp;
            console.log(`${member.displayName} does not have a geographic role and joined ${ageOfMembership} ago`);
        }
    }
});
exports.checkMemberRoles = checkMemberRoles;
