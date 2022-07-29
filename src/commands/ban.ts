import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { Punishments } from "../types/Punishments";
import { supabase } from "../util/supabase";
import { BotError } from "../structs/BotError";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("This command is used to ban a user.")
        .addUserOption(new SlashCommandUserOption().setName("user").setDescription("The user to ban.").setRequired(true))
        .addStringOption(new SlashCommandStringOption().setName("reason").setDescription("The reason to ban.").setRequired(false)),
    permissions: [PermissionFlagsBits.BanMembers],
    async execute(interaction: ChatInputCommandInteraction) {
        const userbanned = false;
        const user = interaction.options.getUser("user");
        if (!(await interaction.guild!.members!.fetch(user!)).bannable) {
            throw new BotError("User is not bannable. (by me at least)", "bperms")
        }
        const reason = interaction.options.getString("reason")? interaction.options.getString("reason") : "No reason specified.";
        const { data, error } = await supabase.from<Punishments>("punishments").select("isActive").eq("serverId", interaction.guildId!).eq("userId", user!.id).eq("type", "ban");
        if (error && error.code != "PGRST116") throw new BotError(error.message, "api", error.code);
        for (const i in data) {
            if (!data[i].isActive) {
                const userbanned = true;
                const values = {
                    userId: user!.id,
                    serverId: interaction.guildId,
                    type: "ban",
                    isActive: true,
                    actor: interaction.user!.id,
                    reason: reason!,
                    unbanActor: null,
                    unbanReason: null
                }
                const { error } = await supabase.from("punishments").insert(values);
                if (error) throw new BotError(error.message, "api", error.code);
                break;
            }
        }

        if (userbanned) {
            throw new BotError("Member already banned", "api");
        }

        const bannedEmbed = new EmbedBuilder()
            .setTitle("Banned")
            .setDescription(`You were banned from ${interaction.guild!.name}`)
            .addFields(
                {name: "Reason", value: reason!},
                {name: "Actor", value: interaction.user!.tag}
            )
            .setColor(0xff0000);

        const sentMessage = true;
        try {
            await user!.send({ embeds: [bannedEmbed] });
        } catch (error: any) {
            if (error.code! == 50007 ) {
                const sendMessage = false;
            } else {
                throw new BotError(error.message, "discord", error.code);
            }
        }

        try {
            await interaction.guild?.members?.ban(user!, { reason: reason!, deleteMessageDays: 0 });
        } catch (error: any) {
            if (error.code === "50013") {
                throw new BotError(error.message, "bperms", error.code);
            } else {
                throw new BotError(error.message, "discord", error.code)
            }
        }
        const successEmbed = new EmbedBuilder()
            .setTitle("Banned Member.")
            .setDescription(`Successfully banned ${user!.tag}`)
            .addFields(
                {name: "Reason", value: reason!},
            )
            .setAuthor({ name: interaction.user!.id, iconURL: interaction.user!.avatarURL.toString() })
            .setThumbnail(user!.avatarURL.toString())
            .setColor(0xff0000);
        sentMessage? null : successEmbed.setFooter( {text: `I was unable to send a message to ${user!.tag}.`} );

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });

    }
}