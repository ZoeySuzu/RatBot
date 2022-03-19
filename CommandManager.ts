/**
*  ZS 19/03/22
*  This function will update the servers available commands and attatch the relevant 
*  listeners to the passed in discord client object. Refering to: 
*  "https://discordjs.guide/interactions/slash-commands.html#registering-slash-commands"
**/
export function UploadCommands(client){

  //Update this list when attaching the bot to new servers with the relevant serverID (aka guildID)
  const serverIDs: string[] = ["692837882343325770","279615532863324160"];
  
  const clientID = "954409833203916860";
  const token =  process.env['Discord_Token'];
  const fs = require('node:fs');
  const {REST} = require('@discordjs/rest');
  const {Routes} = require('discord-api-types/v9');
  const {Collection} = require('discord.js');

  //Populate The commands from the commands folder, we put them in json format and also attact the listners
  let commands = [];
  let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));
  client.commands = new Collection();

  for (const file of commandFiles) {
    //N.B. The file is changed at compile time so we account for the future
  	const command = require(`./commands/${file}`.replace('.ts','.js')); 
  	client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }


  //Send a put request with all the commands to the relevant servers
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
}