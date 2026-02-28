module.exports.config = {
 name: "tag",
 version: "1.0.0",
 hasPermssion: 1,
 credits: "SHAHADAT SAHU",
 description: "Group tag",
 commandCategory: "group",
 usages: "/tag [everyone]",
 cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
 const threadID = event.threadID;
 const threadInfo = await api.getThreadInfo(threadID);
 const memberIDs = threadInfo.participantIDs;

 const repeatCount = parseInt(args[0]) || 1;

 const mentions = memberIDs
 .filter(id => id != api.getCurrentUserID())
 .map(id => ({ tag: "@everyone", id }));

 for (let i = 0; i < repeatCount; i++) {
 await api.sendMessage({
 body: `📢 @everyone আসসালামু আলাইকুম প্রিয় ভাই ও বোনেরা কে কোথায় আছেন?\nসবাই একটু গ্রুপে চলে আসেন 🥰🫶`,
 mentions
 }, threadID);

 await new Promise(resolve => setTimeout(resolve, 2000)); 
 }
};