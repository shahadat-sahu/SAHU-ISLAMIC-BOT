const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
 const base = await axios.get(
 "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
 );
 return base.data.api;
};

module.exports.config = {
 name: "gojol",
 version: "1.0.0",
 credits: "SHAHADAT SAHU",
 countDown: 10,
 hasPermssion: 0,
 usePrefix: true,
 prefix: true,
 description: "Send random islamic gojol",
 category: "media",
 commandCategory: "media",
 usages: "{pn} <name>"
};

module.exports.run = async ({ api, args, event }) => {
 try {
 if (!args[0])
 return api.sendMessage("Gojol name লিখুন ......", event.threadID, event.messageID);

 const keyWord = args.join(" ");
 const searchApi = `${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(
 keyWord + " gojol"
 )}`;

 const results = (await axios.get(searchApi)).data;
 if (!results || results.length === 0)
 return api.sendMessage("কোনো গজল পাওয়া যায়নি.....", event.threadID, event.messageID);

 const random = results[Math.floor(Math.random() * results.length)];
 const videoID = random.id;

 const dlApi = `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`;
 const { data: { title, downloadLink, quality } } = await axios.get(dlApi);

 api.sendMessage(
 {
 body: `🎵 Random Gojol\n• Title: ${title}\n• Quality: ${quality}`,
 attachment: await downloadFile(downloadLink, "gojol.mp3")
 },
 event.threadID,
 () => fs.unlinkSync("gojol.mp3"),
 event.messageID
 );
 } catch (err) {
 api.sendMessage("Error: " + err.message, event.threadID, event.messageID);
 }
};

async function downloadFile(url, filePath) {
 const data = (await axios.get(url, { responseType: "arraybuffer" })).data;
 fs.writeFileSync(filePath, Buffer.from(data));
 return fs.createReadStream(filePath);
}