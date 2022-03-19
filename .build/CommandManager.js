var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  UploadCommands: () => UploadCommands
});
function UploadCommands(client) {
  const serverIDs = ["692837882343325770", "279615532863324160"];
  const clientID = "954409833203916860";
  const token = process.env["Discord_Token"];
  const fs = require("node:fs");
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord-api-types/v9");
  const { Collection } = require("discord.js");
  let commands = [];
  let commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".ts"));
  client.commands = new Collection();
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`.replace(".ts", ".js"));
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }
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
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UploadCommands
});
//# sourceMappingURL=CommandManager.js.map
