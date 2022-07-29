import { EmbedBuilder } from "@discordjs/builders";
import { BotError } from "../structs/BotError";

export function errorHandler(error: BotError) {
    /*
        Error Types

        user: User made a mistake.
        uperms: User doesn't have permission to perform the action.
        bperms: Bot doesn't have permission to perform the action.
        api: Supabase error.
        discord: Discord error.
    */
    switch (error.type) {
        case "user":
            const userEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("A user error occurred. This error is (almost definitely) YOUR fault. Ensure you did the command right.")
                .addFields({ name:"Error Message", value: error.message }, { name: "Error Type", value: "User" })
                .setColor(0xff0000)
                .setFooter({ text:"If this error keeps appearing, please contact a staff member." });
            error.code? userEmbed.addFields({ name: "Error Code", value: error.code.toString() }) : null;
            return userEmbed;
        case "uperms":
            const upermsEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("You don't have permission to perform the action. This error is (almost completely) YOUR fault. Or the fault of staff for not giving you permission.")
                .addFields({ name:"Error Message", value: error.message }, {name:"Error Type", value: "UPerms"})
                .setColor(0xff0000)
                .setFooter({ text:"If this error keeps appearing, please contact a staff member." });
            error.code? upermsEmbed.addFields({ name: "Error Code", value: error.code.toString() }) : null;
            return upermsEmbed;
        case "bperms":
            const bpermsEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("An permissions error occurred. It's (most likely) THE SERVER OWNER'S fault. Make sure the bot has permission to do that.")
                .addFields({ name:"Error Message", value: error.message }, {name:"Error Type", value: "BPerms"})
                .setColor(0xff0000)
                .setFooter({ text:"If this error keeps appearing, please contact a staff member." });
            error.code? bpermsEmbed.addFields({ name: "Error Code", value: error.code.toString() }) : null;
            return bpermsEmbed;
        case "api":
            const apiEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("An unexpected error occurred. It's (most likely) OUR fault.")
                .addFields({ name:"Error Message", value: error.message }, {name:"Error Type", value: "API"})
                .setColor(0xff0000)
                .setFooter({ text:"If this error keeps appearing, please contact a staff member." });
            error.code? apiEmbed.addFields({ name: "Error Code", value: error.code.toString() }) : null;
            console.error("API ERROR:\n" + error);
            return apiEmbed;
        case "discord":
            const discordEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("An unexpected error occurred. It's (most likely) DISCORD'S OR OUR fault. (but most likely Discord).")
                .addFields({ name:"Error Message", value: error.message }, {name:"Error Type", value: "Discord"})
                .setColor(0xff0000)
                .setFooter({ text:"If this error keeps appearing, please contact a staff member." });
            error.code? discordEmbed.addFields({ name: "Error Code", value: error.code.toString() }) : null;
            console.error("DISCORD ERROR:\n" + error);
            return discordEmbed;
        default:
            const unexpectedEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("An unexpected error occurred. It's (most likely) OUR fault.")
                .addFields({ name:"Error Message", value: error.message })
                .setColor(0xff0000)
                .setFooter({ text:"If this error keeps appearing, please contact a staff member." });
            error.code? unexpectedEmbed.addFields({ name: "Error Code", value: error.code.toString() }) : null;
            console.error("UNEXPECTED ERROR\n" + error);
            return unexpectedEmbed;
    }
}