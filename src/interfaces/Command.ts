import { ChatInputCommandInteraction, PermissionResolvable, SlashCommandBuilder } from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    permissions?: PermissionResolvable[];
    ownerOnly?: boolean;
    execute(interaction: ChatInputCommandInteraction, ...args: any): any;
}