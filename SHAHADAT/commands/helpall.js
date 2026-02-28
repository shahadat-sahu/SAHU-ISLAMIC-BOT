const fs = require("fs-extra");
const request = require("request");
const conf = global.config;

module.exports.config = {
 name: "helpall",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "Show all commands in clean modern UI",
 commandCategory: "system",
 usages: "",
 cooldowns: 5,
 usePrefix: true
};

module.exports.run = async function ({ api, event }) {
 const { commands } = global.client;
 const { threadID, messageID } = event;

 const allCommands = [];

 for (let [name] of commands) {
  if (name && name.trim() !== "") {
   allCommands.push(name.trim());
  }
 }

 allCommands.sort();

 const prefix = conf.PREFIX;
 const botName = conf.AuthorBoName;
 const ownerName = conf.AuthorName;
 const total = allCommands.length;

 let text = "✨ COMMAND MENU ✨\n\n";

 allCommands.forEach(cmd => {
  text += `➤ ${prefix}${cmd}\n`;
 });

 text += `
──────────────
Total : ${total}
Prefix: ${prefix}
Bot   : ${botName}
Owner : ${ownerName}`;

 if (conf.AuthorImgur) {
  const imgPath = __dirname + "/cache/helpall.jpg";
  const callback = () =>
   api.sendMessage(
    { body: text, attachment: fs.createReadStream(imgPath) },
    threadID,
    () => fs.unlinkSync(imgPath),
    messageID
   );

  return request(encodeURI(conf.AuthorImgur))
   .pipe(fs.createWriteStream(imgPath))
   .on("close", () => callback());
 }

 return api.sendMessage(text, threadID, messageID);
};