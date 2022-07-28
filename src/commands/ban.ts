import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption, User } from "discord.js";
import { supabase } from "../util/supabase";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("This command is used to ban a user.")
        .addUserOption(new SlashCommandUserOption().setName("user").setDescription("The user to ban.").setRequired(true))
        .addStringOption(new SlashCommandStringOption().setName("reason").setDescription("The reason to ban.").setRequired(false)),
    permissions: [PermissionFlagsBits.BanMembers],
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user");
        const { data, error } = await supabase.from("bans").select("isActive").eq("userId", user!.id);
        await interaction.reply(data?.toString() ? data.toString() : "");
        console.log(data);
        console.log(error);
    }
}