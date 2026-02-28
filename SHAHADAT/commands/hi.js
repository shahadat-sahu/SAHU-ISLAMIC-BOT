const fs = require("fs-extra");
const request = require("request");

const link = [
  "https://i.imgur.com/60l7ZLx.jpeg"
];

module.exports.config = {
  name: "hi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Reply when someone says hi",
  commandCategory: "noprefix",
  usages: "hi",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;

  const body = event.body.toLowerCase().trim();

  if (body.startsWith("hi")) {

    const messages = [
      "হাই হ্যালো না বলে\nসালাম দিতে শিখো প্রিয় 😊🫶"
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const imgPath = __dirname + "/cache/hi.jpg";
    const imgLink = link[Math.floor(Math.random() * link.length)];

    const callback = () =>
      api.sendMessage(
        {
          body: randomMsg,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );

    return request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", callback);
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage("This command works automatically without prefix.", event.threadID, event.messageID);
};