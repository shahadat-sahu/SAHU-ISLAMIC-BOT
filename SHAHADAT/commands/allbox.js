module.exports.config = {
 name: 'allbox',
 version: '1.0.0',
 credits: 'SHAHADAT SAHU',
 hasPermssion: 2,
 description: 'Manage all joined threads',
 commandCategory: 'Admin',
 usages: '[page/all]',
 cooldowns: 0
};

module.exports.handleReply = async function ({ api, event, Threads, handleReply }) {
 if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

 const arg = event.body.split(" ");
 const index = parseInt(arg[1]) - 1;
 const id = handleReply.groupid[index];
 const name = handleReply.groupName[index];

 const moment = require("moment-timezone");
 const time = moment.tz("Asia/Dhaka").format("HH:mm:ss L");

 if (["ban", "Ban"].includes(arg[0])) {
 const data = (await Threads.getData(id)).data || {};
 data.banned = 1;
 data.dateAdded = time;
 await Threads.setData(id, { data });
 global.data.threadBanned.set(id, { dateAdded: data.dateAdded });
 return api.sendMessage(`Group Banned\n${name}\nTID: ${id}`, event.threadID);
 }

 if (["unban", "Unban", "ub", "Ub"].includes(arg[0])) {
 const data = (await Threads.getData(id)).data || {};
 data.banned = 0;
 data.dateAdded = null;
 await Threads.setData(id, { data });
 global.data.threadBanned.delete(id);
 return api.sendMessage(`Group Unbanned\n${name}\nTID: ${id}`, event.threadID);
 }

 if (["del", "Del"].includes(arg[0])) {
 await Threads.delData(id);
 return api.sendMessage(`Deleted Data\n${name}\nTID: ${id}`, event.threadID);
 }

 if (["out", "Out"].includes(arg[0])) {
 api.sendMessage(`Leaving Group\n${name}\nTID: ${id}`, event.threadID, () => {
 api.removeUserFromGroup(api.getCurrentUserID(), id);
 });
 }
};

module.exports.run = async function ({ api, event, args }) {
 const { threadID, messageID } = event;

 if (args[0] === "all") {
 let list = [];
 const data = await api.getThreadList(100, null, ["INBOX"]);

 for (const thread of data) {
 if (thread.isGroup) {
 list.push({
 name: thread.name,
 id: thread.threadID,
 msg: thread.messageCount
 });
 }
 }

 list.sort((a, b) => b.msg - a.msg);

 let text = "";
 let groupid = [];
 let groupName = [];

 list.forEach((g, i) => {
 text += `${i + 1}. ${g.name}\n🔰TID: ${g.id}\nMessages: ${g.msg}\n\n`;
 groupid.push(g.id);
 groupName.push(g.name);
 });

 api.sendMessage(text + "Reply: ban/unban/del/out <number>", threadID, (e, m) => {
 global.client.handleReply.push({
 name: module.exports.config.name,
 author: event.senderID,
 messageID: m.messageID,
 groupid,
 groupName,
 type: 'reply'
 });
 });

 } else {
 let list = [];
 let data = global.data.allThreadID;
 let i = 1;

 for (const id of data) {
 const name = global.data.threadInfo.get(id)?.threadName || "Unknown Group";
 list.push(`${i++}. ${name}\n🔰TID: ${id}`);
 }

 api.sendMessage(
 `🍄There is currently ${list.length} group\n\n${list.join("\n\n")}\n\nReply with: ban/unban/del/out <number>`,
 threadID,
 messageID
 );
 }
};