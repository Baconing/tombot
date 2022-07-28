import { ChatInputCommandInteraction, PermissionResolvable, SlashCommandBuilder } from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    permissions?: PermissionResolvable[];
    execute(interaction: ChatInputCommandInteraction, ...args: any): any;
}