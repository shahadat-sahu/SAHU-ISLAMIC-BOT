module.exports.config = {
 name: "mention",
 version: "1.0.7",
 hasPermssion: 2,
 credits: "SHAHADAT SAHU",
 description: "Mention someone repeatedly (Tag only)",
 commandCategory: "group",
 usages: "/mention @user [count]",
 cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
 const { threadID, mentions } = event;

 if (Object.keys(mentions).length === 0) {
 return api.sendMessage(
 "Please tag someone.\n\nExample:\n/mention @User 5",
 threadID
 );
 }

 const mentionID = Object.keys(mentions)[0];
 const mentionName = mentions[mentionID];

 let count = parseInt(args[args.length - 1]);
 const repeatCount = isNaN(count) ? 1 : Math.min(count, 100);

 for (let i = 0; i < repeatCount; i++) {
 try {
 await api.sendMessage(
 {
 body: `@${mentionName}\nসালামুআলাইকুম প্রিয় মেম্বার কোথায় আছেন আপনাকে ডাকা হচ্ছে দ্রুত চলে আসুন 🥰`,
 mentions: [{ id: mentionID, tag: mentionName }]
 },
 threadID
 );

 if (i < repeatCount - 1) {
 await new Promise(resolve => setTimeout(resolve, 1000));
 }

 } catch (error) {
 console.error("Failed to send mention:", error);
 break;
 }
 }
};