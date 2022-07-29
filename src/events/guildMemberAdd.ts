import { GuildMember, userMention } from "discord.js";
import { Punishments } from "../types/Punishments";
import { supabase } from "../util/supabase";

export default {
    name: "guildMemberAdd",
    once: false,
    async execute(member: GuildMember) {
        const { data, error } = await supabase.from<Punishments>("punishments").select("isActive, type, reason, id").eq("userId", member.user!.id).eq("serverId", member.guild!.id);
        if (error) throw error;
        for (const i in data) {
            if (data[i].isActive && data[i].type == "ban") {
                await member.ban({reason: "Ban "+ data[i].id +"still active: "+ data[i].reason, deleteMessageDays: 0});
            }
        }
    }
}