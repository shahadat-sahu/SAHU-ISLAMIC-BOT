module.exports.config = {
  name: "mp3",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Convert MP4 video to MP3",
  commandCategory: "Media",
  usages: "reply video",
  cooldowns: 0,
  usePrefix: true
};

module.exports.run = async function({ api, args, event }) {
  try {
    const axios = require("axios");
    const fs = require("fs-extra");

    let url;

    if (args.join(" ").trim() !== "") {
      url = args.join(" ");
    } else if (event.messageReply && event.messageReply.attachments.length > 0) {
      url = event.messageReply.attachments[0].url;
    } else {
      return api.sendMessage("Please reply to a video or paste a link.", event.threadID, event.messageID);
    }

    const response = await axios.get(url, {
      method: "GET",
      responseType: "arraybuffer"
    });

    const filePath = __dirname + "/cache/convert.mp3";
    fs.writeFileSync(filePath, Buffer.from(response.data));

    const attachment = fs.createReadStream(filePath);

    api.sendMessage(
      {
        body: "🎵 Video successfully converted to MP3!",
        attachment
      },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );

  } catch (error) {
    console.log(error);
    api.sendMessage("❌ Error converting video to MP3.", event.threadID, event.messageID);
  }
};
