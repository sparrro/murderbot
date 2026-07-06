import { Guild } from "discord.js";
import { findAllMembers } from "./findMemberFunctions";

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
])

export const checkMemberRoles = async (server: Guild) => {

    const members = await findAllMembers(server);

    for (const member of members) {
        if (member.user.bot) continue;

        const hasGeoRole = member.roles.cache.some(role => geoRoles.has(role.id))

        if (hasGeoRole) {
            
        } else {
            const ageOfMembership = Date.now() - member.joinedTimestamp!
            console.log(`${member.displayName} does not have a geographic role and joined ${ageOfMembership} ago`)
        }
    }

}