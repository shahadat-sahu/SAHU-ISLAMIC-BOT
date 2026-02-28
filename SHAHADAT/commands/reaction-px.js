module.exports.config = {
  name: "\n",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Islamick Cyber Chat",
  description: "Auto react when message starts with /",
  commandCategory: "No Prefix",
  cooldowns: 0
};

const cooldown = new Map();

module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;

  const { threadID, messageID, senderID, body } = event;

  if (!body.startsWith("/")) return;

  const now = Date.now();
  const lastUsed = cooldown.get(senderID) || 0;

  if (now - lastUsed < 3000) return;

  cooldown.set(senderID, now);

  api.setMessageReaction("🌺", messageID, () => {}, true);
};

module.exports.run = function () {};