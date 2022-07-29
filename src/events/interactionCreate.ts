import { BaseInteraction, ChatInputCommandInteraction, MessageContextMenuCommandInteraction } from "discord.js";
import { errorHandler } from "../util/errorHandler";
import { bot } from "../index";

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
                        command!.execute(chatInteraction);
                    } catch (e: any) {
                        await chatInteraction.reply(errorHandler(e));
                    }
                } else {
                    await chatInteraction.reply("You don't have permission to run this command.");
                }
            }

            if (command!.permissions) {
                command!.permissions!.forEach(async permission => {
                    if (chatInteraction.memberPermissions!.has(permission) && !commandRan) {
                        commandRan = true;
                        try {
                            command!.execute(chatInteraction);
                        } catch (e: any) {
                            await chatInteraction.reply(errorHandler(e));
                        }
                    }
                });
                if (!commandRan) {
                    await chatInteraction.reply("You don't have permission to run this command.");
                }
            } else if (!commandRan) {
                try {
                    command!.execute(chatInteraction);
                } catch (e: any) {
                    await chatInteraction.reply(errorHandler(e));
                }
            }
        }
    }
}