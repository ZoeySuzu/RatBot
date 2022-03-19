/**
*  ZS 19/03/22
*  Reboot of sheelBot conspiracies, two sub commands allow adding and deleteing new conspiracies and then telling a random conspiracy.
**/

const {SlashCommandBuilder} = require('@discordjs/builders');

const Database = require("@replit/database")
const databaseName = "rb_conspiracies"
const database = new Database()

let conspiracies:string[];
database.get(databaseName).then(value =>{conspiracies = value });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('conspiracy')
    .setDescription('add and tell conspiracies')
    .addSubcommand( subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a conspiracy.')
        .addStringOption(option => 
          option.setName('text')
          .setDescription('The conspiracy to add.')
          .setRequired(true)))
    .addSubcommand( subcommand =>
      subcommand
        .setName('tell')
        .setDescription('Tell a random consipracy.'))
    .addSubcommand( subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete a conspiracy.')
        .addIntegerOption(option => 
          option.setName('position')
          .setDescription('The index of the conspiracy to delete.')
          .setRequired(true))),
  
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'add') {
      let conspiracy = interaction.options.getString("text");
      conspiracies.push(conspiracy);
      database.set(databaseName, conspiracies).then(() => {});
      await interaction.reply('Added conspiracy: '+conspiracy );
    }
    else if (interaction.options.getSubcommand() === 'delete') { 
      let i = interaction.options.getInteger("position")-1;
      let conspiracy = conspiracies[i];
      conspiracies.splice(i,1);
      database.set(databaseName, conspiracies).then(() => {});
      await interaction.reply('Deleted conspiracy: '+conspiracy);
    }
    else{  
       let i = Math.floor(Math.random() * conspiracies.length)
       let randomElement = conspiracies[i];
       await interaction.reply((i+1)+". "+randomElement)
    }
  },
};

