module.exports.config = {
 name: "antijoin",
 version: "1.0.0",
 credits: "SHAHADAT SAHU",
 hasPermssion: 1,
 description: "Control anti join system ",
 usages: "antijoin on | off | status",
 commandCategory: "system",
 cooldowns: 0
};

module.exports.run = async ({ api, event, Threads, args }) => {
 const info = await api.getThreadInfo(event.threadID);
 if (!info.adminIDs.some(i => i.id == api.getCurrentUserID())) {
 return api.sendMessage(
 "[ANTI JOIN] Bot কে group admin করতে হবে",
 event.threadID
 );
 }

 let data = {};
 try {
 data = (await Threads.getData(event.threadID))?.data || {};
 } catch {}

 const action = (args[0] || "").toLowerCase();

 if (action === "on") {
 data.newMember = true;
 await Threads.setData(event.threadID, { data });
 global.data.threadData.set(Number(event.threadID), data);
 return api.sendMessage("✅ AntiJoin ON করা হয়েছে.....", event.threadID);
 }

 if (action === "off") {
 data.newMember = false;
 await Threads.setData(event.threadID, { data });
 global.data.threadData.set(Number(event.threadID), data);
 return api.sendMessage("❎ AntiJoin OFF করা হয়েছে.....", event.threadID);
 }

 if (action === "status") {
 const status = data.newMember === true ? "ON ✅" : "OFF ❌";
 return api.sendMessage(
 `📊 AntiJoin Status: ${status}`,
 event.threadID
 );
 }

 if (typeof data.newMember === "undefined" || data.newMember === false)
 data.newMember = true;
 else
 data.newMember = false;

 await Threads.setData(event.threadID, { data });
 global.data.threadData.set(Number(event.threadID), data);

 return api.sendMessage(
 `🔁 AntiJoin ${data.newMember ? "ON" : "OFF"} করা হয়েছে.....!`,
 event.threadID
 );
};