'use strict';
const { Client, Collection, Intents } = require('discord.js');

//Set up replit server
import {InitiateServer} from './ServerManager.js'; 
InitiateServer();

//Get Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const token =  process.env['Discord_Token'];

//Set up commands
import {UploadCommands} from './CommandManager.js'; 
UploadCommands(client);

//Log in rat bot
client.login(token);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//Listen out for commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});