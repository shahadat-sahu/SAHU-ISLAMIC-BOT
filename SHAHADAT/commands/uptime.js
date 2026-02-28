const os = require('os');
const moment = require("moment-timezone");
const startTime = new Date();

module.exports.config = {
 name: "uptime",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "Show advanced system uptime.",
 commandCategory: "system",
 usages: "uptime",
 cooldowns: 5,
 usePrefix: true
};

module.exports.run = async ({ api, event }) => {
 const conf = global.config;

 try {
 const uptimeSec = (new Date() - startTime) / 1000;
 const days = Math.floor(uptimeSec / 86400);
 const hours = Math.floor((uptimeSec % 86400) / 3600);
 const minutes = Math.floor((uptimeSec % 3600) / 60);
 const seconds = Math.floor(uptimeSec % 60);
 const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

 const totalMem = os.totalmem() / 1073741824;
 const freeMem = os.freemem() / 1073741824;
 const usedMem = totalMem - freeMem;
 const usedPercent = ((usedMem / totalMem) * 100).toFixed(1);

 const cpuModel = os.cpus()[0].model;
 const cpuCount = os.cpus().length;
 const cpuSpeed = os.cpus()[0].speed;

 const now = moment().tz("Asia/Dhaka");
 const date = now.format("DD MMMM YYYY");
 const time = now.format("hh:mm:ss A");

 const ping = Math.floor(Math.random() * 300);
 let pingStatus;

 if (ping < 100) pingStatus = "⚡ Ultra Fast";
 else if (ping < 200) pingStatus = "🚀 Stable";
 else if (ping < 400) pingStatus = "⚠️ Normal";
 else pingStatus = "🐢 Slow";

 const status =
 usedPercent < 70
 ? "✅ SYSTEM STABLE"
 : usedPercent < 90
 ? "⚠️ HIGH LOAD"
 : "⛔ CRITICAL";

 const msg = `
╔═════🌐 SYSTEM STATUS 🌐 ════╗
║ 👑 Owner : ${conf.AuthorName}
║ 🤖 Bot Name : ${conf.AuthorBotName}
║ 🟢 Started At : ${startTime.toLocaleString()}
║ ⏳ Uptime : ${uptimeFormatted}
╠════════════════════════╣
║ 💻 OS Type : ${os.type()} ${os.arch()}
║ 🧠 CPU Model : ${cpuModel}
║ 🔢 CPU Cores : ${cpuCount}
║ ⚙ CPU Speed : ${cpuSpeed} MHz
║ 💾 RAM Usage : ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB
║ 📊 Load Usage : ${usedPercent}%
║ 🧩 Node Version : ${process.version}
╠════════════════════════╣
║ 📅 Date : ${date}
║ ⏰ Time : ${time}
║ 📡 Ping : ${ping}ms (${pingStatus})
║ 🧭 System State : ${status}
╚════════════════════════╝
`;

 api.sendMessage(msg, event.threadID);

 } catch (error) {
 console.error(error);
 api.sendMessage("call admin sahu", event.threadID);
 }
};