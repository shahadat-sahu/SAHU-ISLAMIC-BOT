const fs = require("fs");
const path = require("path");

module.exports.config = {
 name: "give",
 version: "1.0.0",
 hasPermssion: 2,
 credits: "SHAHADAT SAHU",
 description: "Simple file reader",
 commandCategory: "System",
 usages: "[list/list all/fileName]",
 cooldowns: 0,
 usePrefix: true
};

function getAllFiles(dir) {
 let results = [];
 const list = fs.readdirSync(dir);

 list.forEach(file => {
 const filePath = path.join(dir, file);
 const stat = fs.statSync(filePath);

 if (stat && stat.isDirectory()) {
 results = results.concat(getAllFiles(filePath));
 } else if (file.endsWith(".js")) {
 results.push(filePath);
 }
 });

 return results;
}

module.exports.run = async ({ api, event, args }) => {

 if (!args[0])
 return api.sendMessage("Enter command name or 'list'.", event.threadID, event.messageID);

 if (args[0] === "list") {

 if (args[1] === "all") {
 const allFiles = getAllFiles(__dirname);
 let msg = "📂 Full Command List:\n\n";
 allFiles.forEach((f, i) => {
 msg += `${i + 1}. [File📄] ${path.relative(__dirname, f)}\n`;
 });
 return api.sendMessage(msg, event.threadID, event.messageID);
 }

 const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".js"));
 let msg = "📂 Command List:\n\n";
 files.forEach((f, i) => {
 msg += `${i + 1}. [File📄] ${f}\n`;
 });
 return api.sendMessage(msg, event.threadID, event.messageID);
 }

 const safeName = args[0].replace(/[^a-zA-Z0-9_-]/g, "") + ".js";
 const filePath = path.join(__dirname, safeName);

 if (!fs.existsSync(filePath))
 return api.sendMessage("Command file not found.", event.threadID, event.messageID);

 const code = fs.readFileSync(filePath, "utf8");

 if (code.length <= 12000)
 return api.sendMessage(code, event.threadID, event.messageID);

 const cacheDir = path.join(__dirname, "cache");
 if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

 const temp = cacheDir + "/" + safeName.replace(".js", ".txt");
 fs.writeFileSync(temp, code);

 return api.sendMessage(
 { attachment: fs.createReadStream(temp) },
 event.threadID,
 () => fs.unlinkSync(temp),
 event.messageID
 );
};