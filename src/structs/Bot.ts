import { Client, Collection, RESTPostAPIApplicationCommandsJSONBody, Routes, SlashCommandBuilder } from "discord.js";
import { Command } from "src/interfaces/Command";
import * as fs from "fs";
import * as path from "path";
import { REST } from "@discordjs/rest";

export class Bot {
    public commands = new Collection<string, Command>();

    public constructor(public readonly client: Client) {
        this.client.login(process.env.TOKEN!);
        this.importCommands();
        this.eventHandler();
    }

    private async eventHandler() {
        const events = fs.readdirSync(path.join(__dirname, "..", "events")).filter(file => file.endsWith(".js") || file.endsWith(".ts"));
        for (const file of events) {
            const event = await import(path.join(__dirname, "..", "events", `${file}`));
            if (event.once) {
                this.client.once(event.name, (...args) => {
                    event.default.execute(...args);
                });
            } else {
                this.client.on(event.name, (...args) => {
                    event.execute(...args);
                });
            }
        }
    }

    private async importCommands() {
        const commandFiles = fs.readdirSync(path.join(__dirname, "..", "commands")).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
    
        for (const file of commandFiles) {
          const command = await import(path.join(__dirname, "..", "commands", `${file}`));
          this.commands.set(command.default.name, command.default);
        }

        const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
        this.commands.forEach((command: { data: SlashCommandBuilder; }) => commands.push(command.data.toJSON()));
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

        if (process.env.TESTID) {
            rest.put(Routes.applicationGuildCommands(process.env.CLIENTID!, process.env.TESTID!), { body: commands })
                .then(() => console.log('Successfully registered guild application commands.'))
                .catch(console.error);
        } else {
            rest.put(Routes.applicationCommands(process.env.CLIENTID!), { body: commands })
                .then(() => console.log('Successfully registered application commands.'))
                .catch(console.error);
        }
    }
}
