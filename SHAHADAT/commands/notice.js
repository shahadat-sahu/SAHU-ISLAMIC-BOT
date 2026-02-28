const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "notice",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "SHAHADAT SAHU",
  description: "Send notice to all groups (text + media supported)",
  commandCategory: "Admin",
  usages: "/notice <text> or reply + /notice",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args, Users }) => {
  try {
    const allThreads = global.data.allThreadID || [];
    const senderName = await Users.getNameUser(event.senderID);

    if (!allThreads.length) {
      return api.sendMessage("❌ No thread found.", event.threadID);
    }

    const cacheFolder = path.join(__dirname, "cache");
    await fs.ensureDir(cacheFolder);

    let success = 0;
    let failed = 0;

    let messageBody = "";
    let attachments = [];

    // ====== IF REPLY MODE ======
    if (event.type === "message_reply") {
      const reply = event.messageReply;

      messageBody =
        `📢 ADMIN NOTICE\n\n` +
        `From: ${senderName}\n\n` +
        `${reply.body || args.join(" ") || ""}`;

      if (reply.attachments && reply.attachments.length > 0) {
        for (const file of reply.attachments) {
          try {
            const fileUrl = file.url;
            const ext = path.extname(fileUrl).split("?")[0];
            const filePath = path.join(
              cacheFolder,
              `${Date.now()}_${Math.random()}${ext}`
            );

            const response = await axios.get(fileUrl, {
              responseType: "arraybuffer",
            });

            await fs.writeFile(filePath, Buffer.from(response.data));
            attachments.push(fs.createReadStream(filePath));
          } catch (err) {
            console.log("Attachment error:", err);
          }
        }
      }
    }

    // ====== TEXT ONLY MODE ======
    else if (args.length > 0) {
      messageBody =
        `📢 ADMIN NOTICE\n\n` +
        `From: ${senderName}\n\n` +
        `${args.join(" ")}`;
    }

    else {
      return api.sendMessage(
        "ℹ️ Usage:\n• /notice <text>\n• Or reply any message + /notice",
        event.threadID
      );
    }

    // ====== SEND TO ALL THREADS ======
    for (const threadID of allThreads) {
      if (threadID == event.threadID) continue;

      try {
        await api.sendMessage(
          {
            body: messageBody,
            attachment: attachments.length ? attachments : undefined,
          },
          threadID
        );
        success++;
      } catch (err) {
        failed++;
      }

      await new Promise(resolve => setTimeout(resolve, 700));
    }

    // ====== CLEAN CACHE ======
    if (attachments.length) {
      attachments.forEach(stream => {
        try {
          fs.unlinkSync(stream.path);
        } catch {}
      });
    }

    return api.sendMessage(
      `✅ Notice sent to ${success} groups\n❌ Failed: ${failed}`,
      event.threadID
    );

  } catch (error) {
    console.log(error);
    return api.sendMessage("❌ Failed to send notice.", event.threadID);
  }
};