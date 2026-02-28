module.exports.config = {
  name: "listbox",
  version: "2.0.0",
  credits: "SHAHADAT SAHU",
  hasPermssion: 2,
  description: "List all groups where bot is added",
  commandCategory: "system",
  usages: "",
  cooldowns: 10
};

module.exports.handleReply = async function ({ api, event, Threads, handleReply }) {
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  const input = event.body.trim().toLowerCase().split(" ");
  const action = input[0];
  const index = parseInt(input[1]) - 1;

  if (isNaN(index) || index < 0 || index >= handleReply.groupid.length)
    return api.sendMessage("❌ Invalid number.", event.threadID, event.messageID);

  const threadID = handleReply.groupid[index];

  if (action === "ban") {
    const data = (await Threads.getData(threadID)).data || {};
    data.banned = 1;
    await Threads.setData(threadID, { data });
    global.data.threadBanned.set(parseInt(threadID), 1);
    return api.sendMessage(`✅ Thread banned:\n${threadID}`, event.threadID, event.messageID);
  }

  if (action === "out") {
    await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    return api.sendMessage(`🚪 Left group:\n${threadID}`, event.threadID, event.messageID);
  }

  return api.sendMessage("⚠️ Use:\nban 1\nout 1", event.threadID, event.messageID);
};

module.exports.run = async function ({ api, event }) {
  const inbox = await api.getThreadList(100, null, ["INBOX"]);
  const list = inbox.filter(group => group.isSubscribed && group.isGroup);

  let msg = "📋 GROUP LIST (BOT ADDED)\n\n";
  const groupid = [];

  let i = 1;

  for (const group of list) {
    const info = await api.getThreadInfo(group.threadID);

    msg += `${i}. ${group.name}\n`;
    msg += `🆔 ${group.threadID}\n`;
    msg += `👥 Members: ${info.participantIDs.length}\n\n`;

    groupid.push(group.threadID);
    i++;
  }

  msg += "Reply with:\n";
  msg += "ban <number>\n";
  msg += "out <number>";

  return api.sendMessage(
    msg,
    event.threadID,
    (err, data) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          author: event.senderID,
          messageID: data.messageID,
          groupid,
          type: "reply"
        });
      }
    },
    event.messageID
  );
};