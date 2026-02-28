const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "noti",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "SHAHADAT SAHU",
  description: "Admin broadcast + reply system",
  commandCategory: "admin",
  usages: "[message]",
  cooldowns: 10
};

let atmDir = [];

const getAtm = (attachments, body) =>
  new Promise(async resolve => {
    let msg = { body };
    let streams = [];

    for (let file of attachments) {
      try {
        let fileReq = await request.get(file.url);
        let ext = fileReq.uri.pathname.split(".").pop();
        let filePath = __dirname + `/cache/${Date.now()}_${Math.random()}.${ext}`;

        await new Promise(res =>
          fileReq.pipe(fs.createWriteStream(filePath)).on("close", res)
        );

        streams.push(fs.createReadStream(filePath));
        atmDir.push(filePath);
      } catch (e) {
        console.log(e);
      }
    }

    msg.attachment = streams;
    resolve(msg);
  });

module.exports.handleReply = async function ({
  api,
  event,
  handleReply,
  Users,
  Threads
}) {
  const { threadID, messageID, senderID, body } = event;
  const userName = await Users.getNameUser(senderID);

  if (!body) return;

  switch (handleReply.type) {

    case "sendnoti": {
      let groupName =
        (await Threads.getInfo(threadID)).threadName || "Unknown";

      let msg =
        `📩 USER REPLY\n\n` +
        `Message: ${body}\n\n` +
        `User: ${userName}\n` +
        `From: ${groupName}`;

      if (event.attachments.length > 0) {
        msg = await getAtm(event.attachments, msg);
      }

      api.sendMessage(msg, handleReply.threadID, (err, info) => {
        cleanup();
        global.client.handleReply.push({
          name: this.config.name,
          type: "reply",
          messageID: info.messageID,
          threadID
        });
      });

      break;
    }

    case "reply": {
      let msg =
        `📢 ADMIN REPLY\n\n` +
        `Message: ${body}\n\n` +
        `Admin: ${userName}\n\n` +
        `Reply this message to continue chat.`;

      if (event.attachments.length > 0) {
        msg = await getAtm(event.attachments, msg);
      }

      api.sendMessage(msg, handleReply.threadID, () => {
        cleanup();
        global.client.handleReply.push({
          name: this.config.name,
          type: "sendnoti",
          messageID,
          threadID
        });
      });

      break;
    }
  }
};

module.exports.run = async function ({
  api,
  event,
  args,
  Users
}) {
  const { threadID, messageID, senderID } = event;

  if (!args[0]) {
    return api.sendMessage("Please input message", threadID);
  }

  const adminName = await Users.getNameUser(senderID);
  const allThreads = global.data.allThreadID || [];

  let success = 0;
  let failed = 0;

  let msg =
    `📢 ADMIN NOTIFICATION\n\n` +
    `Message: ${args.join(" ")}\n\n` +
    `Admin: ${adminName}`;

  for (let id of allThreads) {
    try {
      await api.sendMessage(msg, id);
      success++;
    } catch {
      failed++;
    }
  }

  api.sendMessage(
    `✅ Sent to ${success} threads\n❌ Failed: ${failed}`,
    threadID,
    messageID
  );
};

function cleanup() {
  atmDir.forEach(path => {
    try {
      fs.unlinkSync(path);
    } catch {}
  });
  atmDir = [];
}