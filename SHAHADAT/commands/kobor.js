module.exports.config = {
  name: "kobor",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Koborer reminder video",
  commandCategory: "Islamic",
  cooldowns: 1,
  dependencies: {
    request: "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const { configPath } = global.client;
  delete require.cache[require.resolve(configPath)];
  const conf = require(configPath);

  const videos = [
    "https://i.imgur.com/wJZCJDt.mp4",
    "https://i.imgur.com/tvl71V8.mp4",
    "https://i.imgur.com/MddkgxW.mp4"
  ];

  const randomVideo = videos[Math.floor(Math.random() * videos.length)];
  const path = __dirname + "/cache/kobor.mp4";

  const message = `===== কবরের ডাক =====
=======================
প্রতি দিন ডাকি তোমায়
              নেই কোন চেতনা,
সময় থাকিতে কর,
              পরকালের সাধনা।

ডাকার মত ডাকব একদিন
              আমি অন্ধকার কবর,
আসতে হবে আমার কোলে,
              রাখনা কোন খবর।

সাপ বিচ্ছু আজব গজব
              থাকবে তুমি একলা,
তোমার যে দিন ডাক পরিবে,
              পরবে কান্নার মেলা।

ছেলে মেয়ে কাঁদবে সবাই
             কেউ হবে না সাথী,
আমি কবর নির্জন গৃহ,
             কেউ দিবে না বাতি।

তোমার সম্বল ঈমানের বল
             হিসাব হবে পথে,
শান্তি যদি পেতে চাও
            আমল আনিও সাথে।

Creator ━➢ ${conf.AuthorBotName}`;

  const send = () => {
    api.sendMessage(
      {
        body: message,
        attachment: fs.createReadStream(path)
      },
      event.threadID,
      () => fs.unlinkSync(path),
      event.messageID
    );
  };

  return request(encodeURI(randomVideo))
    .pipe(fs.createWriteStream(path))
    .on("close", send);
};