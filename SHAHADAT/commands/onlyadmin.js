const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
 name: "onlyadmin",
 version: "1.0.0",
 hasPermssion: 2,
 credits: "SHADAHAT SAHU",
 description: "Admin only mode toggle",
 commandCategory: "Admin",
 usages: "onlyadmin",
 cooldowns: 0
};

module.exports.onLoad = () => {
 const file = path.resolve(__dirname, "cache", "data.json");
 if (!fs.existsSync(file)) {
 fs.writeFileSync(file, JSON.stringify({ adminbox: {} }));
 } else {
 const data = JSON.parse(fs.readFileSync(file));
 if (!data.adminbox) data.adminbox = {};
 fs.writeFileSync(file, JSON.stringify(data));
 }
};

module.exports.run = async ({ api, event }) => {
 const file = path.resolve(__dirname, "cache", "data.json");
 delete require.cache[require.resolve(file)];
 const data = require(file);

 const id = event.threadID;
 if (!data.adminbox) data.adminbox = {};

 data.adminbox[id] = !data.adminbox[id];

 fs.writeFileSync(file, JSON.stringify(data));

 api.sendMessage(
 data.adminbox[id]
 ? "» Admin Only Enabled\nOnly admins can use commands now."
 : "» Admin Only Disabled\nEveryone can use the bot now.",
 id,
 event.messageID
 );
};