module.exports.config = {
  name: "love",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Random halal love video",
  commandCategory: "media",
  usages: "love",
  cooldowns: 5,
  usePrefix: true,
  dependencies: {
    "request": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const messages = [
`- তুমি ভালোবাসা মানে কি বুঝো..??
- আমি তো বুঝি বিয়ের পর বউ এর সাথে হালাল ভালোবাসা, পবিত্র সম্পর্ক...🌸🙈😍`
  ];

  const links = [
    "https://i.imgur.com/LFYQJRq.mp4",
    "https://i.imgur.com/zoR6tOq.mp4",
    "https://i.imgur.com/7mG5CDE.mp4",
    "https://i.imgur.com/uEfLkut.mp4",
    "https://i.imgur.com/OxxMyil.mp4",
    "https://i.imgur.com/nAzmHQr.mp4",
    "https://i.imgur.com/zQaiXht.mp4",
    "https://i.imgur.com/5yL1nW5.mp4",
    "https://i.imgur.com/leaikXn.mp4",
    "https://i.imgur.com/uBMtki3.mp4",
    "https://i.imgur.com/YvuXiQ7.mp4",
    "https://i.imgur.com/JuWNAyW.mp4",
    "https://i.imgur.com/FmMz1mb.mp4",
    "https://i.imgur.com/i5C1YLu.mp4",
    "https://i.imgur.com/Xt0AULd.mp4",
    "https://i.imgur.com/EWmg24Z.mp4",
    "https://i.imgur.com/FUg3SFm.mp4",
    "https://i.imgur.com/T6BlgeA.mp4",
    "https://i.imgur.com/GqgdUhE.mp4",
    "https://i.imgur.com/UgXz2SS.mp4"
  ];

  const randomMsg = messages[Math.floor(Math.random() * messages.length)];
  const randomLink = links[Math.floor(Math.random() * links.length)];

  const filePath = __dirname + "/cache/love.mp4";

  const callback = () => {
    api.sendMessage(
      {
        body: randomMsg,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );
  };

  return request(encodeURI(randomLink))
    .pipe(fs.createWriteStream(filePath))
    .on("close", callback)
    .on("error", () => {
      api.sendMessage("❌ Video load failed.", event.threadID, event.messageID);
    });
};
