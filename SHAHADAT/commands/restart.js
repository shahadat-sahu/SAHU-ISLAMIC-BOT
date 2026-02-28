module.exports.config = {
  name: "restart",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "SHAHADAT SAHU",
  description: "Restart the bot system",
  commandCategory: "system",
  cooldowns: 0
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  api.sendMessage(
    "🔄 Restarting system...\nPlease wait a moment ⏳",
    threadID,
    () => process.exit(1)
  );
};