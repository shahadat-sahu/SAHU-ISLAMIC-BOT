module.exports.config = {
  name: "kickall",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "SHAHADAT SAHU",
  description: "Remove all members from group",
  commandCategory: "system",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, senderID, messageID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const botID = api.getCurrentUserID();

    const botIsAdmin = threadInfo.adminIDs.some(ad => ad.id == botID);
    const senderIsAdmin = threadInfo.adminIDs.some(ad => ad.id == senderID);

    if (!botIsAdmin)
      return api.sendMessage("❌ I need admin permission.", threadID, messageID);

    if (!senderIsAdmin)
      return api.sendMessage("❌ Only group admins can use this command.", threadID, messageID);

    const members = threadInfo.participantIDs.filter(id => id != botID);

    api.sendMessage("⚠️ Removing all members... Please wait.", threadID);

    for (const id of members) {
      await new Promise(resolve => setTimeout(resolve, 800));
      await api.removeUserFromGroup(id, threadID);
    }

    return api.sendMessage("✅ All members removed successfully.", threadID);

  } catch (err) {
    return api.sendMessage("❌ Failed to remove members.", threadID);
  }
};