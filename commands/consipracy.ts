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
        .setDescription('Tell a random consipracy.')),
  
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'add') {
      conspiracies.push(interaction.options.getString("text"))
      database.set(databaseName, conspiracies).then(() => {});
      await interaction.reply('Added conspiracy!');
    }else{  
       let randomElement = conspiracies[Math.floor(Math.random() * conspiracies.length)];
       await interaction.reply(randomElement)
    }
  },
};

