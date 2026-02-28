const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json");
  return base.data.api;
};

module.exports = {
  config: {
    name: "youtube",
    version: "1.0.0",
    credits: "dipto",
    hasPermssion: 0,
    countDown: 5,
    description: "Auto download YouTube video or audio by keyword or link",
    category: "media",
    commandCategory: "media",
    usePrefix: true,
    prefix: true
  },

  run: async ({ api, args, event }) => {
    const { threadID, messageID } = event;

    let action = args[0] ? args[0].toLowerCase() : "-v";
    if (!['-v','video','mp4','-a','audio','mp3'].includes(action)) {
      args.unshift("-v");
      action = "-v";
    }

    const ytRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const isLink = args[1] ? ytRegex.test(args[1]) : false;

    const format = ['-v','video','mp4'].includes(action) ? "mp4" : "mp3";

    try {
      await api.setMessageReaction("⌛", messageID, () => {}, true);

      let videoID;
      let titleText = "";

      if (isLink) {
        videoID = args[1].match(ytRegex)[1];
      } else {
        args.shift();
        const keyword = args.join(" ");
        if (!keyword) {
          await api.setMessageReaction("⚠️", messageID, () => {}, true);
          return api.sendMessage("❌ Please provide a keyword.", threadID, messageID);
        }

        const search = (await axios.get(
          `${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(keyword)}`
        )).data;

        if (!search.length) {
          await api.setMessageReaction("⚠️", messageID, () => {}, true);
          return api.sendMessage("⭕ No results found.", threadID, messageID);
        }

        videoID = search[0].id;
        titleText = search[0].title;
      }

      const path = `ytb_auto_${videoID}.${format}`;
      const { data } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${videoID}&format=${format}&quality=1`
      );

      await api.sendMessage({
        body: `🎬 ${titleText || data.title}\n📦 Auto Download`,
        attachment: await downloadFile(data.downloadLink, path)
      }, threadID, () => fs.unlinkSync(path), messageID);

      await api.setMessageReaction("✅", messageID, () => {}, true);

    } catch (e) {
      await api.setMessageReaction("⚠️", messageID, () => {}, true);
      return api.sendMessage("❌ Failed to download.", threadID, messageID);
    }
  }
};

async function downloadFile(url, path) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(path, Buffer.from(res.data));
  return fs.createReadStream(path);
}