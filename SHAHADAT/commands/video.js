const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json");
  return base.data.api;
};

module.exports = {
  config: {
    name: "video",
    version: "1.0.0",
    credits: "dipto",
    hasPermssion: 0,
    countDown: 5,
    description: "Auto small size YouTube video downloader by keyword",
    commandCategory: "media",
    usePrefix: true,
  },

  run: async ({ api, args, event }) => {
    const { threadID, messageID } = event;

    if (!args[0]) return api.sendMessage("❌ Please provide a keyword.", threadID, messageID);

    const keyword = args.join(" ");

    try {
      await api.setMessageReaction("⌛", messageID, () => {}, true);

      const search = (await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(keyword)}`)).data;

      if (!search.length)
        return api.sendMessage("⭕ No results found.", threadID, messageID);

      const video = search[0]; 

      const videoID = video.id;
      const format = "mp4";

      const path = `auto_${videoID}.mp4`;

      const { data } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${videoID}&format=${format}&quality=1`
      );

      await api.sendMessage({
        body: `🎬 ${video.title}\n📦 Auto Small Size Video`,
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