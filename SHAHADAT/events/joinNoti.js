module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "Islamick Cyber Chat",
  description: "Send join notification with random media",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "pidusage": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];

  const dir = join(__dirname, "SAHU");
  if (!existsSync(dir)) mkdirSync(dir);

  const gifFolder = join(dir, "joinGif");
  if (!existsSync(gifFolder)) mkdirSync(gifFolder);

  const videoFile = join(dir, "sahu.mp4");
  if (!existsSync(videoFile)) mkdirSync(dir);
};

module.exports.run = async function ({ api, event }) {
  const { join } = global.nodemodule["path"];
  const { createReadStream, existsSync, readdirSync } = global.nodemodule["fs-extra"];
  const fs = require("fs");
  const threadID = event.threadID;

  const added = event.logMessageData.addedParticipants || [];

  const botAdded = added.find(i => i.userFbId == api.getCurrentUserID());

  if (botAdded) {
    api.changeNickname(
      `[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || ""}`,
      threadID,
      api.getCurrentUserID()
    );

    return api.sendMessage(
      {
        body: `╭•┄┅═══❁🌺❁═══┅┄•╮
 আসসালামু আলাইকুম-!!🖤💫
╰•┄┅═══❁🌺❁═══┅┄•╯

________________________
𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞 🖤🤗

𝐈 𝐰𝐢𝐥𝐥 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮 𝐢𝐧𝐬𝐡𝐚𝐚𝐥𝐥𝐚𝐡 🌺❤️
________________________

Commands:
${global.config.PREFIX}help
${global.config.PREFIX}info
${global.config.PREFIX}admin

✦•─•❁🌺 ${global.config.BOTNAME} 🌺❁•─•✦`,
        attachment: fs.createReadStream(__dirname + "/SAHU/sahu.mp4")
      },
      threadID
    );
  }

  try {
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);

    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    const gifFolder = join(__dirname, "SAHU", "joinGif");

    let mentions = [],
      nameArray = [],
      memLength = [],
      i = 0;

    for (let p of added) {
      const userName = p.fullName;
      nameArray.push(userName);
      mentions.push({ tag: userName, id: p.userFbId });
      memLength.push(participantIDs.length - i++);
    }

    memLength.sort((a, b) => a - b);

    let msg =
      typeof threadData.customJoin == "undefined"
        ? `╭•┄┅═══❁🌺❁═══┅┄•╮
   আসসালামু আলাইকুম-!!🖤
╰•┄┅═══❁🌺❁═══┅┄•╯

✨🆆🅴🅻🅻 🅲🅾🅼🅴✨

❥ 𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑  
[ {name} ]

༆-✿ আপনাকে আমাদের  
{threadName}

✨🌺 এর পক্ষ থেকে স্বাগতম 🌺✨

❤️🫰 ভালোবাসা অবিরাম 🫰❤️

༆-✿ আপনি এই গ্রুপের {soThanhVien} নং মেম্বার

╭•┄┅═══❁🌺❁═══┅┄•╮
   ${global.config.BOTNAME}
╰•┄┅═══❁🌺❁═══┅┄•╯`
        : threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, nameArray.join(", "))
      .replace(/\{soThanhVien}/g, memLength.join(", "))
      .replace(/\{threadName}/g, threadName);

    const files = existsSync(gifFolder) ? readdirSync(gifFolder) : [];
    let formPush = { body: msg, mentions };

    if (files.length > 0) {
      const randomFile = files[Math.floor(Math.random() * files.length)];
      const filePath = join(gifFolder, randomFile);
      formPush.attachment = createReadStream(filePath);
    }

    return api.sendMessage(formPush, threadID);
  } catch (e) {
    console.log(e);
  }
};