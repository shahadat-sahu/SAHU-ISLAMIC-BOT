module.exports.config = {
  name: "bn",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  usePrefix: true,
  description: "Translate to Bangla",
  commandCategory: "media",
  usages: ".bn [text or reply]",
  cooldowns: 2
};

module.exports.run = async ({ api, event, args }) => {
  const request = require("request");
  let text;

  if (event.type === "message_reply") {
    text = event.messageReply.body;
  } else {
    text = args.join(" ");
  }

  if (!text) return api.sendMessage("Write something or reply to a message.", event.threadID, event.messageID);

  const url = encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=bn&dt=t&q=${text}`);

  request(url, (err, res, body) => {
    if (err) return api.sendMessage("Translation error!", event.threadID, event.messageID);
    const result = JSON.parse(body);
    let translated = "";
    result[0].forEach(part => { if (part[0]) translated += part[0]; });
    api.sendMessage(translated, event.threadID, event.messageID);
  });
};