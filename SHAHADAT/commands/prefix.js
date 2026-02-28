module.exports.config = {
 name: "prefix",
 version: "1.0.1",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "prefix trigger with random videos",
 commandCategory: "no prefix",
 usages: "type prefix",
 cooldowns: 0,
 dependencies: { request: "", "fs-extra": "" }
};

module.exports.handleEvent = async ({ api, event }) => {
 const msg = event.body?.trim();
 if (!msg) return;

 const allowed = ["prefix", "Prefix", "PREFIX"];
 if (!allowed.includes(msg)) return;

 const fs = require("fs-extra");
 const request = require("request");

 // এগুলো চেঞ্জ করার কোন প্রয়োজন নেই ⚠️
 const prefix = global.config.PREFIX || "/";
 const botName = global.config.BOTNAME || "ISLAMIC CHAT BOT";
 const owner = global.config.AuthorName || "SHAHADAT SAHU";

 const threadInfo = global.data.threadInfo.get(event.threadID) || {};
 const groupName = threadInfo.threadName || "Group Name";

 // Caption এখানে কাস্টমাইজ করার কোনো প্রয়োজন নেই✅
 const caption = `
🌐 This is ${botName}

🔰 Bot Prefix : ${prefix}
👑 Owner : ${owner}
📦 Group Name : ${groupName}

📖 How To Use:
➤ ${prefix}help
➤ ${prefix}menu
➤ ${prefix}admin

🤲 May Allah bless this group
🌿 Stay connected with Islamic knowledge`;

 // Video list প্রয়োজন হলে নতুন ভিডিও এড করবেন ✅
 const videos = [
 "https://i.imgur.com/tgyYHxK.mp4",
 "https://i.imgur.com/vGpURXm.mp4",
 "https://i.imgur.com/eEjDHOx.mp4",
 "https://i.imgur.com/5IrQemR.mp4",
 "https://i.imgur.com/wTgcXu6.mp4",
 "https://i.imgur.com/ou9B75x.mp4",
 "https://i.imgur.com/rom1k2M.mp4",
 "https://i.imgur.com/VWzw29e.mp4",
 "https://i.imgur.com/h3eWRW8.mp4",
 "https://i.imgur.com/H0xjsff.mp4"
 ];

 const video = videos[Math.floor(Math.random() * videos.length)];
 const path = __dirname + "/prefixvideo.mp4";

 request(video)
 .pipe(fs.createWriteStream(path))
 .on("close", () => {
 api.sendMessage(
 {
 body: caption,
 attachment: fs.createReadStream(path)
 },
 event.threadID,
 () => fs.unlinkSync(path)
 );
 });
};

module.exports.run = () => {};