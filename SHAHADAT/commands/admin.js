const fs = require("fs-extra");
const path = require("path");
const request = require("request");
const moment = require("moment-timezone");

module.exports.config = {
 name: "admin",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "Show Owner Info",
 commandCategory: "Info",
 usages: "admin",
 cooldowns: 2,
 usePrefix: true
};

module.exports.run = async ({ api, event }) => {
 const conf = global.config;
 const mediaLink = conf.AuthorPhoto;

 const date = moment().tz("Asia/Dhaka").format("DD/MM/YYYY");
 const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A");

 const body = `
👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢

👤 Name : ${conf.AuthorName}
🧸 NickName : ${conf.AuthorNickName}
🚹 Gender : ${conf.AuthorGender}
❤️ Relation : ${conf.AuthorRelationalStatus}
🎂 Age : ${conf.AuthorAge}
🕌 Religion : ${conf.AuthorReligion}
🏡 Address : ${conf.AuthorLocation}

🌐 𝗖𝗢𝗡𝗧𝗔𝗖𝗧

📘 Facebook :
${conf.AuthorFacebook}

💬 Messenger :
${conf.AuthorMessenger}

🔰 GitHub :
${conf.AuthorGithub}

📲 WhatsApp :
${conf.AuthorWhatsApp}

🕒 Updated
📅 Date : ${date}
⏰ Time : ${time}
🌍 TZ : Asia/Dhaka
`;

 if (!mediaLink) {
 return api.sendMessage(body, event.threadID);
 }

 const cacheDir = path.join(__dirname, "cache");
 if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

 const ext = path.extname(mediaLink.split("?")[0]) || ".bin";
 const mediaPath = path.join(cacheDir, `admin${ext}`);

 let sent = false;

 const send = () => {
 if (sent) return;
 sent = true;

 api.sendMessage(
 {
 body,
 attachment: fs.createReadStream(mediaPath)
 },
 event.threadID,
 () => fs.unlinkSync(mediaPath)
 );
 };

 request(encodeURI(mediaLink))
 .pipe(fs.createWriteStream(mediaPath))
 .on("close", send)
 .on("error", () => api.sendMessage(body, event.threadID));
};