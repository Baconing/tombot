import { PostgrestError, RealtimeSubscription } from "@supabase/supabase-js";
import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption, User } from "discord.js";
import interactionCreate from "src/events/interactionCreate";
import { supabase } from "../util/supabase";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("This command is used to ban a user.")
        .addUserOption(new SlashCommandUserOption().setName("user").setDescription("The user to ban.").setRequired(true))
        .addStringOption(new SlashCommandStringOption().setName("reason").setDescription("The reason to ban.").setRequired(false)),
    permissions: [PermissionFlagsBits.BanMembers],
    ownerOnly: false,
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason")? interaction.options.getString("reason") : "No reason specified";
        const { data, error } = await supabase.from("bans").select("isActive").eq("userId", user!.id);
        if (data!.entries!.length <= 0) {
            const values = {
                userId: user!.id,
                isActive: true,
                actor: interaction.user!.id,
                reason: reason!
            }
            try {
                const { data, error } = await supabase.from("bans").insert(values);
                if (error) throw error;
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            throw new Error("Member already banned");
        }
        try {
            await interaction.guild?.members?.ban(user!, { reason: reason!, deleteMessageDays: 0 });
        } catch (error: any) {
            throw new Error(error.message);
        }
        const successEmbed = new EmbedBuilder()
            .setTitle("Banned Member.")
            .setDescription(`Successfully banned ${user!.tag}`)
            .addFields(
                {name: "Reason", value: reason!},
            )
            .setAuthor({ name: interaction.user!.id, iconURL: interaction.user!.avatarURL.toString() })
            .setThumbnail(user!.avatarURL.toString());

        await interaction.reply({ embeds: [successEmbed] });

    }
}