import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AMY_ID, MY_ID } from "../config";
import { demoteModerator } from "../utils/weapons";
import { findByUsername } from "../utils/findMemberFunctions";

export default {
    data: new SlashCommandBuilder()
        .setName("demote")
        .setDescription("Demotes a targeted moderator")
        .addStringOption(option => option
            .setName("mod")
            .setDescription("The moderator to be demoted")
            .setRequired(true)
            .addChoices(
                { name: "gloo", value: "goop_glop" },
                { name: "teemothee", value: "tee_mo_thee" },
                { name: "lykophos", value: "bleppysneppy" },
                { name: "namire", value: "_namire" },
                { name: "amy", value: "bearandwine" }
            )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const userId = interaction.member?.user.id;
        if (userId == MY_ID || userId == AMY_ID) {
            interaction.reply("I hear you father")
            /* const modName = interaction.options.getString("mod")!;
            const mod = await findByUsername(interaction.guild!, modName);
            await demoteModerator(mod!); */
        } else interaction.reply("I don't know you");
    }
};