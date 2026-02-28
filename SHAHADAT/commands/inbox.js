module.exports.config = {
  name: "inbox",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Send message to user's inbox",
  commandCategory: "system",
  usages: "inbox",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID } = event;

  const userName = await Users.getNameUser(senderID);
  const botName = global.config.BOTNAME;

  const privateMessage = `✨ Assalamu Alaikum ${userName} ✨

This is your personal inbox message from ${botName} 🤖

If you need help, contact admin.
Stay blessed 🌸`;

  api.sendMessage(privateMessage, senderID);

  return api.sendMessage(
    "✅ Check your inbox 📩",
    threadID,
    messageID
  );
};