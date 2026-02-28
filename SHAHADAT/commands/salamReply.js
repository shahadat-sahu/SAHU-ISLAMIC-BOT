module.exports.config = {
 name: "salam",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "Reply only to specific salam messages",
 commandCategory: "noprefix",
 cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event, Threads, Users }) {
 if (!event.body) return;

 const text = event.body.trim().toLowerCase().replace(/\s+/g, " ");

 const allowed = [
 "assalamualaikum",
 "assalamu alaikum",
 "assalamu alaikum",
 "আসসালামু আলাইকুম",
 "আসসালামুআলাইকুম",
 "আসসালামুয়ালাইকুম"
 ];

 if (!allowed.includes(text)) return;

 const name = await Users.getNameUser(event.senderID);

 return api.sendMessage(
`╭•┄┅═══❁🌺❁═══┅┄•╮
 ওয়ালাইকুমুস সালাম 🤍
╰•┄┅═══❁🌺❁═══┅┄•╯

🌿 প্রিয় ${name},
আল্লাহ আপনার উপর রহমত বর্ষণ করুন 🤲`,
 event.threadID,
 event.messageID
 );
};

module.exports.run = async function ({ api, event, Threads }) {
 const threadID = event.threadID;
 const messageID = event.messageID;

 let threadData = await Threads.getData(threadID);
 let data = threadData.data || {};

 if (typeof data.salam === "undefined") data.salam = true;

 data.salam = !data.salam;

 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);

 return api.sendMessage(
 data.salam ? "✅ Salam auto reply is now ON" : "❌ Salam auto reply is now OFF",
 threadID,
 messageID
 );
};