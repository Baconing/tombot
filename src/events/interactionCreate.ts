import { BaseInteraction, ChatInputCommandInteraction } from "discord.js";
import { errorHandler } from "../util/errorHandler";
import { bot } from "../index";
import { BotError } from "../structs/BotError";

export default {
    name: "interactionCreate",
    once: false,
    async execute(interaction: BaseInteraction) {
        if (interaction.isChatInputCommand()) {
            const chatInteraction = interaction as ChatInputCommandInteraction;
            const command = bot.commands.get(chatInteraction.commandName);
            let commandRan = false;

            if (command!.ownerOnly) {
                // bug: anyone can run owneronly commands
                if (chatInteraction.user!.id == process.env.OWNERID!) {
                    commandRan = true;
                    try {
                        await command!.execute(chatInteraction);
                    } catch (error) {
                        await chatInteraction.reply({ embeds: [errorHandler((error as BotError))], ephemeral: true });
                    }
                } else {
                    await chatInteraction.reply({ embeds: [errorHandler(new BotError("User Missing Permissions", "uperms"))], ephemeral: true });
                }
            }

            if (command!.permissions) {
                command!.permissions!.forEach(async permission => {
                    if (chatInteraction.memberPermissions!.has(permission) && !commandRan) {
                        commandRan = true;
                        try {
                            await command!.execute(chatInteraction);
                        } catch (error) {
                            await chatInteraction.reply({ embeds: [errorHandler((error as BotError))], ephemeral: true });
                        }
                    }
                });
                if (!commandRan) {
                    await chatInteraction.reply({ embeds: [errorHandler(new BotError("User Missing Permissions", "uperms"))], ephemeral: true });
                }
            } else if (!commandRan) {
                try {
                    await command!.execute(chatInteraction);
                } catch (error) {
                    await chatInteraction.reply({ embeds: [errorHandler((error as BotError))], ephemeral: true });
                }
            }
        }
    }
}