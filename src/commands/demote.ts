import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { AMY_ID, MY_ID } from "../config";
import { demoteModerator } from "../utils/weapons";
import { findByUsername } from "../utils/findMemberFunctions";

//since slash commands are turning out to be a colossal pain in the ass to set up, I will do it with dms for now and maybe return to this later

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
            interaction.reply({ content: "I hear you father", flags: MessageFlags.Ephemeral });
            const modName = interaction.options.getString("mod")!;
            interaction.reply({ content: `You want me to demote ${modName}`, flags: MessageFlags.Ephemeral });
            /* const mod = await findByUsername(interaction.guild!, modName);
            await demoteModerator(mod!); */
        } else interaction.reply("I don't know you");
    }
};