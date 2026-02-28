const axios = require("axios");
const fs = require("fs-extra");
const tinyurl = require("tinyurl");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports.config = {
  name: "autodl",
  version: "1.0.0",
  credits: "SHAHADAT SAHU",
  hasPermssion: 0,
  commandCategory: "no prefix"
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;
  const text = event.body.trim();

  const isLink = /(https?:\/\/[^\s]+)/gi;
  if (!isLink.test(text)) return;

  try {
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const senderName = await api.getUserInfo(event.senderID).then(i => i[event.senderID].name);
    const botName = global.config.BOTNAME;

    const { data } = await axios.get(
      `${await baseApiUrl()}/alldl?url=${encodeURIComponent(text)}`
    );

    if (!data.result) return;

    const source = data.cp || "Unknown";

    const filePath = __dirname + `/cache/auto_dl.mp4`;
    const video = (await axios.get(data.result, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(filePath, Buffer.from(video, "utf-8"));

    const shortUrl = await tinyurl.shorten(data.result);

    api.sendMessage(
      {
        body: `⚡ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱!

🎬 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺: ${source}
👤 𝗨𝘀𝗲𝗿: ${senderName}
🤖 𝗕𝗼𝘁: ${botName}

⬇️ 𝗬𝗼𝘂𝗿 𝗩𝗶𝗱𝗲𝗼 𝗶𝘀 𝗥𝗲𝗮𝗱𝘆!
🔗 ${shortUrl}`,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );

    api.setMessageReaction("✅", event.messageID, () => {}, true);

  } catch (e) {
    return; 
  }
};

module.exports.run = async () => {};
