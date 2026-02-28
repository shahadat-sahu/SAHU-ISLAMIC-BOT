module.exports.config = { 
 name: "help", 
 version: "1.1.0", 
 hasPermssion: 0, 
 credits: "SHAHADAT SAHU", 
 description: "Show all commands and command details", 
 commandCategory: "system", 
 usages: "[command/page/all]", 
 cooldowns: 5, 
 usePrefix: true 
};

module.exports.run = function ({ api, event, args }) {
 const { commands } = global.client;
 const { threadID, messageID } = event;
 const request = require("request");
 const fs = require("fs-extra");

 const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
 const prefix = threadSetting.PREFIX || global.config.PREFIX || "/";

 const imageUrl = global.config.AuthorImgur;
 const cacheDir = __dirname + "/cache";
 const filePath = cacheDir + "/help.jpg";

 if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

 const input = (args[0] || "").toLowerCase();
 const command = commands.get(input);

 if (command && input !== "all") {
 const permission = command.config.hasPermssion == 0 ? "0 (Everyone)"
 : command.config.hasPermssion == 1 ? "1 (Group Admin)"
 : command.config.hasPermssion == 2 ? "2 (Bot Admin)"
 : "3 (Bot Owner)";

 const details = `
✨ COMMAND DETAILS ✨

🔰 Name: ${command.config.name}
📂 Category: ${command.config.commandCategory || "No Category"}
📝 Description: ${command.config.description || "No Description"}
👤 Permission: ${permission}
⏳ Cooldown: ${command.config.cooldowns || 0}s
📖 Usage: ${prefix}${command.config.name} ${command.config.usages || ""}

🌼 Prefix: ${global.config.PREFIX}
🌸 Bot Name: ${global.config.BOTNAME}
👑 Owner: ${global.config.AuthorName}
`;

 if (imageUrl) {
 request(encodeURI(imageUrl))
 .pipe(fs.createWriteStream(filePath))
 .on("close", () => api.sendMessage(
 { body: details.trim(), attachment: fs.createReadStream(filePath) },
 threadID, () => fs.unlinkSync(filePath)
 ))
 .on("error", () => api.sendMessage(details.trim(), threadID, messageID));
 } else api.sendMessage(details.trim(), threadID, messageID);

 return;
 }

 const arrayInfo = [];
 for (let [name] of commands) if (name && name.trim() !== "") arrayInfo.push(name.trim());
 arrayInfo.sort();

 if (input === "all") {
 const msg = arrayInfo.map(cmd => `║ ❏ ${cmd}`).join("\n");
 const text = `
╔════════════════════════╗
║ 🌐 ALL COMMANDS 🌐
╠════════════════════════╣
${msg}
╠════════════════════════╣
║ 🌼 Prefix: ${global.config.PREFIX}
║ 🌸 Bot Name: ${global.config.BOTNAME}
║ 👑 Owner: ${global.config.AuthorName}
╚════════════════════════╝
`;

 if (imageUrl) {
 request(encodeURI(imageUrl))
 .pipe(fs.createWriteStream(filePath))
 .on("close", () => api.sendMessage(
 { body: text.trim(), attachment: fs.createReadStream(filePath) },
 threadID, () => fs.unlinkSync(filePath)
 ))
 .on("error", () => api.sendMessage(text.trim(), threadID, messageID));
 } else api.sendMessage(text.trim(), threadID, messageID);

 return;
 }

 const page = parseInt(args[0]) || 1;
 const perPage = 30;
 const totalPages = Math.ceil(arrayInfo.length / perPage);
 const start = perPage * (page - 1);
 const helpView = arrayInfo.slice(start, start + perPage);

 let msg = "";
 for (let cmd of helpView) msg += `║ ❏ ${cmd}\n`;

 const text = `
╔════════════════════════╗
║ 🌐 COMMAND LIST 🌐
╠════════════════════════╣
║ ✴️ Page: ${page}/${totalPages}
║ 🔰 Total: ${arrayInfo.length}
╠════════════════════════╣
${msg}╠════════════════════════╣
║ 🌼 Prefix: ${global.config.PREFIX}
║ 🌸 Bot Name: ${global.config.BOTNAME}
║ 👑 Owner: ${global.config.AuthorName}
╚════════════════════════╝
`;

 if (imageUrl) {
 request(encodeURI(imageUrl))
 .pipe(fs.createWriteStream(filePath))
 .on("close", () => api.sendMessage(
 { body: text.trim(), attachment: fs.createReadStream(filePath) },
 threadID, () => fs.unlinkSync(filePath)
 ))
 .on("error", () => api.sendMessage(text.trim(), threadID, messageID));
 } else api.sendMessage(text.trim(), threadID, messageID);
};