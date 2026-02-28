module.exports.config = {
 name: "group",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "Group settings controller",
 commandCategory: "box",
 usages: "[name/emoji/admin/image/info]",
 cooldowns: 1,
 dependencies: {
 "axios": "",
 "fs-extra": ""
 }
};

module.exports.run = async ({ api, event, args }) => {
 const axios = global.nodemodule["axios"];
 const fs = global.nodemodule["fs-extra"];

 if (args[0] === "info") {
 const info = await api.getThreadInfo(event.threadID);

 const name = info.threadName || "None";
 const threadID = info.threadID;
 const emoji = info.emoji || "None";
 const approval = info.approvalMode ? "ON" : "OFF";
 const totalMembers = info.participantIDs.length;
 const adminCount = info.adminIDs.length;
 const totalMessages = info.messageCount || 0;

 let male = 0, female = 0;
 if (info.userInfo) {
 info.userInfo.forEach(u => {
 if (u.gender === "MALE") male++;
 else if (u.gender === "FEMALE") female++;
 });
 }

 let adminNames = "";
 for (const admin of info.adminIDs) {
 try {
 const u = await api.getUserInfo(admin.id);
 adminNames += `• ${u[admin.id].name}\n`;
 } catch {
 adminNames += `• ${admin.id}\n`;
 }
 }

 const groupText =
`📌 GROUP INFORMATION

📛 Name: ${name}
🆔 ID: ${threadID}
😀 Emoji: ${emoji}
🔐 Approval Mode: ${approval}

👥 Members: ${totalMembers}
👨 Male: ${male}
👩 Female: ${female}

👑 Admins (${adminCount}):
${adminNames}

💬 Total Messages: ${totalMessages}`;

 const imgURL = info.imageSrc;

 if (!imgURL) {
 return api.sendMessage(groupText, event.threadID);
 }

 const path = __dirname + "/cache/ginfo.png";

 try {
 const dl = (await axios.get(imgURL, { responseType: "arraybuffer" })).data;
 fs.writeFileSync(path, Buffer.from(dl, "binary"));

 return api.sendMessage(
 { body: groupText, attachment: fs.createReadStream(path) },
 event.threadID,
 () => fs.unlinkSync(path)
 );

 } catch {
 return api.sendMessage(groupText, event.threadID);
 }
 }

 return api.sendMessage("Invalid group command.", event.threadID);
};