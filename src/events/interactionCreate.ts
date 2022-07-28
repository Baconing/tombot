import { BaseInteraction, ChatInputCommandInteraction } from "discord.js";
import { bot } from "../index";

export default {
    name: "interactionCreate",
    once: false,
    async execute(interaction: BaseInteraction) {
        console.log("debug");
        if (interaction.isChatInputCommand()) {
            console.log("debug");
            const chatInteraction = interaction as ChatInputCommandInteraction;
            const command = bot.commands.get(chatInteraction.commandName);
            if (command!.permissions) {
                command!.permissions.forEach(permission => {
                    if (chatInteraction.memberPermissions!.has(permission)) {
                        command!.execute(chatInteraction);
                        return;
                    }
                });
                await chatInteraction.reply("You don't have permission to run this command.");
                return;
            } else {
                command!.execute(chatInteraction);
            }
        }
    }
}