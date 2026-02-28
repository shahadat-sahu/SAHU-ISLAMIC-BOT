module.exports.config = {
 name: "pending",
 version: "1.0.0",
 credits: "SHAHADAT SAHU",
 hasPermssion: 2,
 description: "Manage pending group approvals",
 commandCategory: "Admin",
 cooldowns: 0,
 usePrefix: true
};

module.exports.languages = {
 en: {
 invalidNumber: "Invalid number: %1",
 cancelSuccess: "Cancelled %1 group(s).",
 approveSuccess: "Approved %1 group(s).",
 cantGetPendingList: "Could not get pending list.",
 returnListPending:
`PENDING GROUP LIST

Total Groups: %1

%2

Reply:
all / add all = approve all
1 3 5 / add 1 3 = approve selected
c 1 3 / c all = cancel`,

 returnListClean: "No pending groups found.",
 
 welcome1: `Assalamu Alaikum ${global.config.BOTNAME} has successfully joined your group.`,
 welcome2: `Type /help to see available commands.`
 }
};

module.exports.handleReply = async function ({ api, event, handleReply, getText }) {
 if (event.senderID != handleReply.author) return;

 const body = event.body.toLowerCase().trim();
 let count = 0;

 api.unsendMessage(handleReply.messageID);

 if (body === "c all") {
 for (const g of handleReply.pending) {
 try {
 await api.removeUserFromGroup(api.getCurrentUserID(), g.threadID);
 count++;
 } catch {}
 }
 return api.sendMessage(`Cancelled ALL (${count}) groups.`, event.threadID);
 }

 if (body.startsWith("c ")) {
 const numbers = body.match(/\d+/g) || [];
 for (const num of numbers) {
 const index = parseInt(num);
 if (!index || index > handleReply.pending.length)
 return api.sendMessage(getText("invalidNumber", num), event.threadID);

 try {
 await api.removeUserFromGroup(api.getCurrentUserID(), handleReply.pending[index - 1].threadID);
 count++;
 } catch {}
 }
 return api.sendMessage(getText("cancelSuccess", count), event.threadID);
 }

 if (body === "all" || body === "add all") {
 for (const g of handleReply.pending) {
 try {
 const id = g.threadID;

 await api.changeNickname(
 `[ ${global.config.PREFIX} ] • ${global.config.BOTNAME}`,
 id,
 api.getCurrentUserID()
 );

 await api.sendMessage(getText("welcome1"), id);
 await api.sendMessage(getText("welcome2"), id);

 count++;
 } catch {}
 }
 return api.sendMessage(`Approved ALL (${count}) groups.`, event.threadID);
 }

 const numbers = body.match(/\d+/g) || [];
 if (numbers.length === 0)
 return api.sendMessage("Invalid input.", event.threadID);

 for (const num of numbers) {
 const index = parseInt(num);

 if (!index || index > handleReply.pending.length)
 return api.sendMessage(getText("invalidNumber", num), event.threadID);

 try {
 const id = handleReply.pending[index - 1].threadID;

 await api.changeNickname(
 `[ ${global.config.PREFIX} ] • ${global.config.BOTNAME}`,
 id,
 api.getCurrentUserID()
 );

 await api.sendMessage(getText("welcome1"), id);
 await api.sendMessage(getText("welcome2"), id);

 count++;
 } catch {}
 }

 api.sendMessage(getText("approveSuccess", count), event.threadID);
};

module.exports.run = async function ({ api, event, getText }) {
 try {
 const [spam, pending] = await Promise.all([
 api.getThreadList(100, null, ["OTHER"]),
 api.getThreadList(100, null, ["PENDING"])
 ]);

 const list = [...spam, ...pending].filter(g => g.isSubscribed && g.isGroup);

 if (list.length === 0)
 return api.sendMessage(getText("returnListClean"), event.threadID);

 const text = list
 .map((g, i) => `${i + 1}. ${g.name || "Unnamed Group"}\nID: ${g.threadID}`)
 .join("\n\n");

 api.sendMessage(
 getText("returnListPending", list.length, text),
 event.threadID,
 (e, info) => {
 if (!e) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 author: event.senderID,
 pending: list,
 messageID: info.messageID
 });
 }
 }
 );
 } catch {
 api.sendMessage(getText("cantGetPendingList"), event.threadID);
 }
};