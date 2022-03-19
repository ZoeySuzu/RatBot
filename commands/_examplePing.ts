/**
*  ZS 19/03/22
*  Example class for a simple discord slash command.
**/

const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};