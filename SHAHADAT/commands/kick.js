module.exports.config = {
 name: "kick",
 version: "1.0.0",
 hasPermssion: 1,
 credits: "SHAHADAT SAHU",
 description: "Kick mentioned or replied user",
 commandCategory: "system",
 usages: "@tag or reply",
 cooldowns: 0
};

module.exports.run = async function ({ api, event }) {
 const { threadID, senderID, messageID } = event;

 try {
 const threadInfo = await api.getThreadInfo(threadID);
 const botID = api.getCurrentUserID();

 const botIsAdmin = threadInfo.adminIDs.some(ad => ad.id == botID);
 const senderIsAdmin = threadInfo.adminIDs.some(ad => ad.id == senderID);

 if (!botIsAdmin)
 return api.sendMessage("Bot needs group admin permission.....", threadID, messageID);

 if (!senderIsAdmin)
 return api.sendMessage("Only group admins can use this command....", threadID, messageID);

 let targetID;

 if (Object.keys(event.mentions).length > 0) {
 targetID = Object.keys(event.mentions)[0];
 } 
 else if (event.messageReply) {
 targetID = event.messageReply.senderID;
 } 
 else {
 return api.sendMessage("Mention or reply someone to kick......", threadID, messageID);
 }

 if (targetID == botID)
 return api.sendMessage("I can't kick myself.....", threadID, messageID);

 if (targetID == senderID)
 return api.sendMessage("You can't kick yourself....", threadID, messageID);

 await api.removeUserFromGroup(targetID, threadID);

 return api.sendMessage("✅ Member has been removed.", threadID);

 } catch (err) {
 return api.sendMessage("❌ Failed to kick user.", threadID);
 }
};