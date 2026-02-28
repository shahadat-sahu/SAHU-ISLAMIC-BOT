module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "SHAHADAT SAHU", //Sorry for changing the credit🫶
  description: "Notify with random media",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];

  const folder = join(__dirname, "SAHU", "leaveGif");
  if (!existsSync(folder)) mkdirSync(folder, { recursive: true });
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { createReadStream, existsSync, readdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const threadID = event.threadID;
  const moment = require("moment-timezone");

  const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
  const hour = moment.tz("Asia/Dhaka").format("HH");

  const data = global.data.threadData.get(parseInt(threadID)) ||
    (await Threads.getData(threadID)).data;

  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) ||
    await Users.getNameUser(event.logMessageData.leftParticipantFbId);

  const type = event.author == event.logMessageData.leftParticipantFbId ? "leave" : "managed";

  const session =
    hour <= 10 ? "Morning" :
      hour <= 12 ? "Noon" :
        hour <= 18 ? "Afternoon" :
          "Night";

  let msg =
    typeof data.customLeave == "undefined"
      ? `•—»✨ ${name} ✨«—•
        ｢ 𝗔𝗟𝗟𝗔𝗛𝗔𝗙𝗘𝗭 ｣
•—»✨ ${type} ✨«—•

💠 •—»✨ বড্ড ভুল করলে ✨«—•
💠 •—»✨ ${name} ✨«—•

📥 ইসলামিক গ্রুপ থেকে বের হয়ে  
এই সুন্দর আল্লাহভীরু পরিবারটি ছেড়ে চলে গেছে।  
অনুগ্রহ করে কেউ তার অনুসরণ করবেন না… 💙🥺

🕙 সময়: ${session}  
📅 তারিখ: ${time}

✨ আল্লাহ আপনাকে হেদায়েত দান করুন ✨`
      : data.customLeave;

  const folder = join(__dirname, "SAHU", "leaveGif");
  const files = existsSync(folder) ? readdirSync(folder) : [];

  let formPush = { body: msg };

  if (files.length > 0) {
    const file = files[Math.floor(Math.random() * files.length)];
    const filePath = join(folder, file);
    formPush.attachment = createReadStream(filePath);
  }

  return api.sendMessage(formPush, threadID);
};
