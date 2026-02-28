module.exports.config = {
  name: "adminUpdate",
  eventType: [
    "log:thread-admins",
    "log:thread-name",
    "log:user-nickname",
    "log:thread-call",
    "log:thread-icon",
    "log:thread-color",
    "log:link-status",
    "log:magic-words",
    "log:thread-approval-mode",
    "log:thread-poll"
  ],
  version: "1.0.0",
  credits: "SHAHADAT SAHU",
  description: "Premium group update notifications",
  envConfig: { autoUnsend: true, sendNoti: true, timeToUnsend: 30 }
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  const { author, threadID, logMessageType, logMessageData } = event;
  const { setData, getData } = Threads;
  const fs = require("fs");

  var iconPath = __dirname + "/emoji.json";
  if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}));


  if (author == api.getCurrentUserID()) return;

  if (author == threadID) return;

  try {
    let dataThread = (await getData(threadID)).threadInfo;

    const sendAndDelete = (msg) => {
      api.sendMessage(msg, threadID, async (err, info) => {
        if (!err && global.configModule.adminUpdate.autoUnsend) {
          await new Promise((res) =>
            setTimeout(res, global.configModule.adminUpdate.timeToUnsend * 1000)
          );
          api.unsendMessage(info.messageID);
        }
      });
    };

    switch (logMessageType) {
      case "log:thread-admins": {
        if (logMessageData.ADMIN_EVENT == "add_admin") {
          dataThread.adminIDs.push({ id: logMessageData.TARGET_ID });
          sendAndDelete(
            `✦•──•❁🌸 এডমিন যুক্ত করা হয়েছে 🌸❁•──•✦
👤 ইউজার: ${logMessageData.TARGET_ID}`
          );
        } else {
          dataThread.adminIDs = dataThread.adminIDs.filter(
            (i) => i.id != logMessageData.TARGET_ID
          );
          sendAndDelete(
            `✦•──•❁🍁 এডমিন রিমুভ করা হয়েছে 🍁❁•──•✦
👤 ইউজার: ${logMessageData.TARGET_ID}`
          );
        }
        break;
      }

      case "log:user-nickname": {
        dataThread.nicknames[logMessageData.participant_id] =
          logMessageData.nickname;
        sendAndDelete(
          `✦•──•❁🌸 নিকনেম আপডেট 🌸❁•──•✦
👤 ইউজার: ${logMessageData.participant_id}
📝 নতুন নিক: ${
            logMessageData.nickname.length == 0
              ? "মুছে ফেলা হয়েছে"
              : logMessageData.nickname
          }`
        );
        break;
      }

      case "log:thread-name": {
        dataThread.threadName = logMessageData.name || null;
        sendAndDelete(
          `✦•──•❁🌺 গ্রুপ নাম পরিবর্তন করা হয়েছে 🌺❁•──•✦
📝 নতুন নাম: ${dataThread.threadName}`
        );
        break;
      }

      case "log:thread-icon": {
        let preIcon = JSON.parse(fs.readFileSync(iconPath));
        dataThread.threadIcon = logMessageData.thread_icon;

        sendAndDelete(
          `✦•──•❁🌺 গ্রুপে আইকন পরিবর্তন করা হয়েছে 🌺❁•──•✦
🔸 নতুন আইকন: ${logMessageData.thread_icon}
🔹 আগের আইকন: ${preIcon[threadID] || "Unknown"}`
        );

        preIcon[threadID] = dataThread.threadIcon;
        fs.writeFileSync(iconPath, JSON.stringify(preIcon));
        break;
      }

      case "log:thread-call": {
        if (logMessageData.event == "group_call_started") {
          const name = await Users.getNameUser(logMessageData.caller_id);
          sendAndDelete(
            `✦•──•❁🌸 গ্রুপ কল শুরু 🌸❁•──•✦
☎️ কল করেছেন: ${name}`
          );
        }
        if (logMessageData.event == "group_call_ended") {
          const d = logMessageData.call_duration;
          let h = Math.floor(d / 3600);
          let m = Math.floor((d % 3600) / 60);
          let s = d % 60;
          sendAndDelete(
            `✦•──•❁🍁 গ্রুপ কল শেষ 🍁❁•──•✦
⏱ ডিউরেশন: ${h}:${m}:${s}`
          );
        }
        break;
      }

      case "log:magic-words": {
        sendAndDelete(
          `✦•──•❁🌸 থিম আপডেট 🌸❁•──•✦
✨ ইফেক্ট: ${event.logMessageData.theme_name}`
        );
        break;
      }

      case "log:thread-color": {
        dataThread.threadColor = logMessageData.thread_color;
        sendAndDelete(
          `✦•──•❁🌸 গ্রুপ কালার পরিবর্তন 🌸❁•──•✦
🎨 নতুন কালার সেট হয়েছে`
        );
        break;
      }

      case "log:thread-poll":
      case "log:thread-approval-mode": {
        sendAndDelete(event.logMessageBody);
        break;
      }
    }

    await setData(threadID, { threadInfo: dataThread });

  } catch (e) {
    console.log(e);
  }
};