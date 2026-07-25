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
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
//since slash commands are turning out to be a colossal pain in the ass to set up, I will do it with dms for now and maybe return to this later
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("demote")
        .setDescription("Demotes a targeted moderator")
        .addStringOption(option => option
        .setName("mod")
        .setDescription("The moderator to be demoted")
        .setRequired(true)
        .addChoices({ name: "gloo", value: "goop_glop" }, { name: "teemothee", value: "tee_mo_thee" }, { name: "lykophos", value: "bleppysneppy" }, { name: "namire", value: "_namire" }, { name: "amy", value: "bearandwine" })),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id;
            if (userId == config_1.MY_ID || userId == config_1.AMY_ID) {
                interaction.reply({ content: "I hear you father", flags: discord_js_1.MessageFlags.Ephemeral });
                const modName = interaction.options.getString("mod");
                interaction.reply({ content: `You want me to demote ${modName}`, flags: discord_js_1.MessageFlags.Ephemeral });
                /* const mod = await findByUsername(interaction.guild!, modName);
                await demoteModerator(mod!); */
            }
            else
                interaction.reply("I don't know you");
        });
    }
};
