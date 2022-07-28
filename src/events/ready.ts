import { Client } from "discord.js"

export default {
    name: "ready",
    once: false,
    async execute(client: Client) {
        console.log(`Logged in as ${client.user!.tag}`);
    }
}