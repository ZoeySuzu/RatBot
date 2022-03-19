'use strict';
import express from 'express';
const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
//Connect to discord
const token =  process.env['Discord_Token'];


//Start bot server
const app = express();
app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(3000)

client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
  //The file is changed at compile time so we account for the future
	const command = require(`./commands/${file}`.replace('.ts','.js')); 
	client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

const clientID = "954409833203916860";
const serverIDs: string[] = ["692837882343325770","279615532863324160"];



const rest = new REST({ version: '9' }).setToken(token);
(async () => {
  serverIDs.forEach(async (guildID) => {
  	try {
  		console.log('Started refreshing '+guildID+' (/) commands.');
  
  		await rest.put(
  			Routes.applicationGuildCommands(clientID, guildID),
  			{ 
          body: commands
        },
  		);
  
  		console.log('Successfully reloaded '+guildID+' (/) commands.');
  	} catch (error) {
  		console.error(error);
  	}
  });
})();

//Log in bot
client.login(token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

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