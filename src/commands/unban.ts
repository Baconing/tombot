import { ChatInputCommandInteraction, discordSort, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { BotError } from "../structs/BotError";
import { Punishments } from "../types/Punishments";
import { supabase } from "../util/supabase";

export default {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from the server.")
        .addUserOption(new SlashCommandUserOption().setName("user").setDescription("The user to unban.").setRequired(true))
        .addStringOption(new SlashCommandStringOption().setName("reason").setDescription("Reason for the unban").setRequired(false)),
    permissions: [PermissionsBitField.Flags.BanMembers],
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason")? interaction.options.getString("reason") : "No reason specified.";
        const { data, error } = await supabase.from<Punishments>("punishments").select("isActive, id").eq("serverId", interaction.guildId!).eq("userId", user!.id).eq("type", "ban");
        if (error && error.code == "PGRST116") {
            throw new BotError("Member not banned.", "user");
        } else if (error) {
            throw new BotError(error.message, "api", error.code);
        }
        for (const i in data) {
            if (data[i].isActive) { 
                const updates = { 
                    isActive: false, 
                    "unbanActor": interaction.user!.id,
                    "unbanReason": reason
                }
                const { error } = await supabase.from<Punishments>("punishments").update(updates).match( { id: data[i].id });
                if (error) throw new BotError(error.message, "api", error.code);
                try {
                    await interaction.guild?.bans.remove(user!, reason!);
                } catch (error: any) {
                    if (error.code == "50013") {
                        throw new BotError(error.message, "bperms", error.code);
                    } else {
                        throw new BotError(error.message, "discord", error.code);
                    }
                }
                const successEmbed = new EmbedBuilder()
                    .setTitle("Unbanned Member.")
                    .setDescription(`Successfully unbanned ${user!.tag}`)
                    .addFields(
                        {name: "Reason", value: reason!},
                    )
                    .setAuthor({ name: interaction.user!.id, iconURL: interaction.user!.avatarURL.toString() })
                    .setThumbnail(user!.avatarURL.toString())
                    .setColor(0x00FF00);
            }
        }
    }
}