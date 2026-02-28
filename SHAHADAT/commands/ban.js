module.exports.config = {
 name: "ban",
 version: "1.0.0",
 hasPermssion: 2,
 credits: "SHAHADAT SAHU",
 description: "Ban or unban a user",
 commandCategory: "system",
 usages: "ban <UID/@tag/reply> | unban <UID/@tag/reply>",
 cooldowns: 3
};

module.exports.run = async function ({ api, event, args, Users }) {
 const { threadID, messageReply, messageID, mentions, body } = event;

 if (!args[0] && !messageReply && Object.keys(mentions).length === 0)
 return api.sendMessage("Usage: ban/unban <UID/@tag> or reply to user", threadID, messageID);

 const command = body.split(" ")[0].replace(global.config.PREFIX, "").toLowerCase();

 let targetID =
 messageReply?.senderID ||
 Object.keys(mentions)[0] ||
 args[0];

 if (!targetID || isNaN(targetID))
 return api.sendMessage("Invalid UID / Tag / Reply!", threadID, messageID);

 let userData;
 try {
 userData = await Users.getData(targetID);
 } catch {
 await Users.setData(targetID, { data: {} });
 userData = await Users.getData(targetID);
 }

 const name = await Users.getNameUser(targetID);

 if (command === "ban") {
 userData.data.banned = true;
 await Users.setData(targetID, { data: userData.data });

 global.data.userBanned.set(targetID, {
 reason: null,
 date: new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })
 });

 return api.sendMessage(
 `🚫 Banned User:\n${targetID} - ${name}`,
 threadID,
 messageID
 );
 }

 if (command === "unban") {
 if (!userData.data.banned)
 return api.sendMessage(
 `User ${targetID} - ${name} is not banned.`,
 threadID,
 messageID
 );

 userData.data.banned = false;
 await Users.setData(targetID, { data: userData.data });

 global.data.userBanned.delete(targetID);

 return api.sendMessage(
 `✅ Unbanned User:\n${targetID} - ${name}`,
 threadID,
 messageID
 );
 }

 return api.sendMessage("Use: ban / unban <UID/@tag/reply>", threadID, messageID);
};
