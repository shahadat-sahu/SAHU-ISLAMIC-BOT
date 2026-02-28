const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
 name: "load",
 version: "1.0.0",
 hasPermssion: 2,
 credits: "SHAHADAT SAHU",
 description: "Reload commands",
 commandCategory: "System",
 usages: "load [commandName]",
 cooldowns: 0,
 usePrefix: true
};

module.exports.run = async function ({ api, event, args }) {
 const { threadID, messageID, senderID } = event;

 if (!global.config.ADMINBOT.includes(String(senderID))) {
 return api.sendMessage("Only Bot Admin can use this command.", threadID, messageID);
 }

 const root = global.client.mainPath;

 const findCommandsFolder = (dir) => {
 const files = fs.readdirSync(dir);
 for (const file of files) {
 const full = path.join(dir, file);
 if (fs.statSync(full).isDirectory()) {
 if (file.toLowerCase() === "commands") return full;
 const deep = findCommandsFolder(full);
 if (deep) return deep;
 }
 }
 return null;
 };

 const commandsPath = findCommandsFolder(root);
 if (!commandsPath) {
 return api.sendMessage("Commands folder not found.", threadID, messageID);
 }

 const target = args[0];
 let loaded = [];
 let failed = [];

 const loadFile = (filePath) => {
 try {
 delete require.cache[require.resolve(filePath)];
 const cmd = require(filePath);
 if (!cmd.config?.name) return failed.push(path.basename(filePath));
 global.client.commands.set(cmd.config.name, cmd);
 loaded.push(cmd.config.name);
 } catch {
 failed.push(path.basename(filePath));
 }
 };

 const walk = (dir) => {
 const files = fs.readdirSync(dir);
 for (const file of files) {
 const full = path.join(dir, file);
 if (fs.statSync(full).isDirectory()) walk(full);
 else if (file.endsWith(".js")) loadFile(full);
 }
 };

 if (!target) {
 global.client.commands.clear();
 walk(commandsPath);
 } else {
 let found = false;

 const search = (dir) => {
 const files = fs.readdirSync(dir);
 for (const file of files) {
 const full = path.join(dir, file);
 if (fs.statSync(full).isDirectory()) search(full);
 else if (file.endsWith(".js")) {
 try {
 const name = require(full).config?.name;
 if (name === target) {
 found = true;
 global.client.commands.delete(name);
 loadFile(full);
 }
 } catch {}
 }
 }
 };

 search(commandsPath);

 if (!found) {
 return api.sendMessage(`Command not found: ${target}`, threadID, messageID);
 }
 }

 let msg = `Successful Load ${loaded.length} Command ✅\n\n`;
 msg += `Failed ${failed.length} Command ⚠️\n`;
 if (failed.length) msg += failed.join("\n");

 return api.sendMessage(msg, threadID, messageID);
};