module.exports.config = {
 name: "profile",
 version: "1.0.2",
 hasPermssion: 0,
 credits: "Shahadat SAHU",
 description: "Get Facebook UID and profile links",
 commandCategory: "utility",
 cooldowns: 5
};

module.exports.run = async function({ event, api, args }) {
 const fs = require("fs-extra");
 const request = require("request");
 
 let uid;
 let name;
 
 const sendResult = async (uid) => {
 try {
 const picURL = `https://graph.facebook.com/${uid}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
 const path = __dirname + `/cache/${uid}.png`;
 
 await new Promise((resolve) => {
 request(encodeURI(picURL))
 .pipe(fs.createWriteStream(path))
 .on("close", resolve);
 });
 
 if (!name) {
 const userInfo = await api.getUserInfo(uid);
 name = userInfo[uid]?.name || "Unknown";
 }
 
 const message = {
 body: `╔══════════❖🌺❖══════════╗
║ 👤 𝐍𝐚𝐦𝐞 : ${name}
║ 🆔 𝐔𝐬𝐞𝐫 𝐔𝐈𝐃 : ${uid}
║ 🔗 𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐋𝐢𝐧𝐤 :
║ m.me/${uid}
║ 🌐 𝐅𝐁 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 : 
║ fb.com/${uid}
╚══════════❖🌺❖══════════╝`,
 attachment: fs.createReadStream(path)
 };
 
 api.sendMessage(message, event.threadID, () => {
 fs.unlinkSync(path);
 }, event.messageID);
 
 } catch (error) {
 console.error(error);
 api.sendMessage("⚠️ An error occurred! Please try again.", event.threadID, event.messageID);
 }
 };
 
 if (event.type === "message_reply") {
 uid = event.messageReply.senderID;
 return sendResult(uid);
 }
 
 if (!args[0]) {
 uid = event.senderID;
 return sendResult(uid);
 }
 
 if (args[0].includes("facebook.com/") || args[0].includes("fb.com/")) {
 try {
 const profileURL = args[0];
 uid = await api.getUID(profileURL);
 return sendResult(uid);
 } catch {
 return api.sendMessage("⚠️ Couldn't get UID from Facebook link!", event.threadID, event.messageID);
 }
 }
 
 if (Object.keys(event.mentions).length > 0) {
 uid = Object.keys(event.mentions)[0];
 name = event.mentions[uid];
 return sendResult(uid);
 }
 
 if (!isNaN(args[0])) {
 uid = args[0];
 return sendResult(uid);
 }
 
 api.sendMessage("⚠️", event.threadID, event.messageID);
};