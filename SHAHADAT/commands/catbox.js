const axios = require("axios");

const baseApiUrl = async () => {
 const base = await axios.get(
 "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
 );
 return base.data.api;
};

module.exports.config = {
 name: "catbox",
 version: "1.0.1",
 hasPermssion: 0,
 credits: "Nazrul",
 description: "Upload file to Catbox",
 commandCategory: "Utility",
 usages: "",
 cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
 try {
 const fileUrl = event.messageReply?.attachments?.[0]?.url;

 if (!fileUrl) {
 return api.sendMessage(
 "Reply to a file",
 event.threadID,
 event.messageID
 );
 }

 const wait = await api.sendMessage("Uploading...", event.threadID);

 const { data } = await axios.get(
 `${await baseApiUrl()}/catbox?url=${encodeURIComponent(fileUrl)}`
 );

 await api.unsendMessage(wait.messageID);

 return api.sendMessage(data.url, event.threadID, event.messageID);

 } catch (e) {
 return api.sendMessage("Upload error", event.threadID, event.messageID);
 }
};