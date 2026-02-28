module.exports.config = {
 name: "fork",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "Send fork repository link",
 commandCategory: "general",
 usages: "fork",
 cooldowns: 0
};

module.exports.run = async function({ api, event }) {
 api.sendMessage(
 "https://github.com/shahadat-sahu/SAHU-CHAT-BOT.git",
 event.threadID,
 event.messageID
 );
};

// ===== Noprefix Support =====
module.exports.handleEvent = async function({ api, event }) {
 if (!event.body) return;
 const text = event.body.toLowerCase().trim();
 if (text === "fork") {
 return api.sendMessage(
 "https://github.com/shahadat-sahu/SAHU-ISLAMIC-BOT.git",
 event.threadID,
 event.messageID
 );
 }
};