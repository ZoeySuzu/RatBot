"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var import_express = __toModule(require("express"));
const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Collection, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const token = process.env["Discord_Token"];
const app = (0, import_express.default)();
app.listen(() => {
  console.log("Server started");
});
client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".ts"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`.replace(".ts", ".js"));
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}
const clientID = "954409833203916860";
const serverIDs = ["692837882343325770", "279615532863324160"];
const rest = new REST({ version: "9" }).setToken(token);
(async () => {
  serverIDs.forEach(async (guildID) => {
    try {
      console.log("Started refreshing " + guildID + " (/) commands.");
      await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
        body: commands
      });
      console.log("Successfully reloaded " + guildID + " (/) commands.");
    } catch (error) {
      console.error(error);
    }
  });
})();
client.login(token);
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand())
    return;
  const command = client.commands.get(interaction.commandName);
  if (!command)
    return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
  }
});
//# sourceMappingURL=index.js.map
