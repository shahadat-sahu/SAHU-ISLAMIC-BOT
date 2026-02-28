module.exports.config = {
 name: "pp",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "Get profile picture of user",
 commandCategory: "tool",
 cooldowns: 0
};

module.exports.run = async function({ event, api, args, Users }) {
 const fs = global.nodemodule["fs-extra"];
 const request = global.nodemodule["request"];

 if (event.type === "message_reply") {
 const uid = event.messageReply.senderID;
 const callback = () =>
 api.sendMessage(
 {
 body: "== PROFILE ==",
 attachment: fs.createReadStream(__dirname + "/cache/pp.png")
 },
 event.threadID,
 () => fs.unlinkSync(__dirname + "/cache/pp.png"),
 event.messageID
 );

 return request(
 encodeURI(
 `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
 )
 )
 .pipe(fs.createWriteStream(__dirname + "/cache/pp.png"))
 .on("close", () => callback());
 }

 if (!args[0]) {
 const uid = event.senderID;

 const callback = () =>
 api.sendMessage(
 {
 body: "== PROFILE ==",
 attachment: fs.createReadStream(__dirname + "/cache/pp.png")
 },
 event.threadID,
 () => fs.unlinkSync(__dirname + "/cache/pp.png"),
 event.messageID
 );

 return request(
 encodeURI(
 `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
 )
 )
 .pipe(fs.createWriteStream(__dirname + "/cache/pp.png"))
 .on("close", () => callback());
 } else {
 if (args[0].includes(".com/")) {
 const res_ID = await api.getUID(args[0]);

 const callback = () =>
 api.sendMessage(
 {
 body: "== PROFILE ==",
 attachment: fs.createReadStream(__dirname + "/cache/pp.png")
 },
 event.threadID,
 () => fs.unlinkSync(__dirname + "/cache/pp.png"),
 event.messageID
 );

 return request(
 encodeURI(
 `https://graph.facebook.com/${res_ID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
 )
 )
 .pipe(fs.createWriteStream(__dirname + "/cache/pp.png"))
 .on("close", () => callback());
 } else {
 const uid = Object.keys(event.mentions)[0];

 const callback = () =>
 api.sendMessage(
 {
 body: "== PROFILE ==",
 attachment: fs.createReadStream(__dirname + "/cache/pp.png")
 },
 event.threadID,
 () => fs.unlinkSync(__dirname + "/cache/pp.png"),
 event.messageID
 );

 return request(
 encodeURI(
 `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
 )
 )
 .pipe(fs.createWriteStream(__dirname + "/cache/pp.png"))
 .on("close", () => callback());
 }
 }
};