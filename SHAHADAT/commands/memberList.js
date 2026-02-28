module.exports.config = {
  name: "memberlist",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Display group members with Facebook ID",
  commandCategory: "tools",
  usages: "memberlist",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const participants = threadInfo.participantIDs;

    const userInfo = await api.getUserInfo(participants);

    let msg = `📋 GROUP MEMBER LIST\n\n`;
    msg += `Group Name : ${threadInfo.name}\n`;
    msg += `Group ID   : ${event.threadID}\n`;
    msg += `Total      : ${participants.length}\n\n`;

    let count = 1;

    for (const id of participants) {
      const name = userInfo[id]?.name || "Unknown";
      msg += `${count++}. ${name}\n`;
      msg += `ID: ${id}\n`;
      msg += `Link: https://facebook.com/${id}\n\n`;
    }

    return api.sendMessage(msg, event.threadID, event.messageID);

  } catch (err) {
    return api.sendMessage("Failed to fetch member list.", event.threadID, event.messageID);
  }
};