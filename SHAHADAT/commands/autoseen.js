const fs = require("fs-extra");
const pathFile = __dirname + "/cache/autoseen.txt";

if (!fs.existsSync(pathFile)) {
  fs.writeFileSync(pathFile, "false");
}

module.exports.config = {
  name: "autoseen",
  version: "1.0.1",
  hasPermission: 2,
  credits: "SHAHADAT SAHU",
  description: "Auto seen messages",
  commandCategory: "tools",
  usages: "on/off",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {

  const status = fs.readFileSync(pathFile, "utf-8");

  if (status === "true") {
    api.markAsReadAll(() => {});
  }

};

module.exports.run = async function ({ api, event, args }) {

  try {

    if (args[0] === "on") {

      fs.writeFileSync(pathFile, "true");
      return api.sendMessage(
        "autoseen turn on successfully.",
        event.threadID,
        event.messageID
      );

    }

    if (args[0] === "off") {

      fs.writeFileSync(pathFile, "false");
      return api.sendMessage(
        "autoseen turn off successfully.",
        event.threadID,
        event.messageID
      );

    }

    return api.sendMessage(
      `Wrong format\nUse ${global.config.PREFIX}${this.config.name} ${this.config.usages}`,
      event.threadID,
      event.messageID
    );

  } catch (err) {
    console.log(err);
  }

};