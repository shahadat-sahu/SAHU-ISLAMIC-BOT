module.exports.config = {
  name: "pick",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Shaon Ahmed",
  description: "Pinterest image search",
  commandCategory: "Media",
  usages: "pic <keyword> [amount]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const fs = require("fs-extra");

  if (args.length === 0)
    return api.sendMessage("Type something to search!\nExample: /pic cat", event.threadID, event.messageID);

  const resp = await axios.get("https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json");
  const apiBase = resp.data.noobs;

  const keyword = args.slice(0, -1).join(" ") || args.join(" ");
  const amount = isNaN(args[args.length - 1]) ? 6 : parseInt(args[args.length - 1]);

  api.sendMessage("🔍 Searching...", event.threadID, (err, info) => {
    global.searchMsg = info.messageID;
  });

  try {
    const res = await axios.get(`${apiBase}/pinterest?search=${encodeURIComponent(keyword)}`);
    let images = res.data.data;

    if (!images || images.length === 0) {
      api.unsendMessage(global.searchMsg);
      return api.sendMessage("No results found!", event.threadID);
    }

    let total = Math.min(images.length, amount);
    let attachments = [];

    for (let i = 0; i < total; i++) {
      if (!images[i]) continue;

      const filePath = __dirname + `/cache/pic_${i}.jpg`;
      const imgData = (await axios.get(images[i], { responseType: "arraybuffer" })).data;
      fs.writeFileSync(filePath, imgData);
      attachments.push(fs.createReadStream(filePath));
    }

    api.sendMessage(
      {
        body: `${total} results found for: ${keyword}`,
        attachment: attachments
      },
      event.threadID,
      () => {
        api.unsendMessage(global.searchMsg);
        for (let i = 0; i < total; i++) {
          const p = __dirname + `/cache/pic_${i}.jpg`;
          if (fs.existsSync(p)) fs.unlinkSync(p);
        }
      },
      event.messageID
    );
  } catch (err) {
    api.unsendMessage(global.searchMsg);
    api.sendMessage("Failed to load images!", event.threadID);
  }
};
