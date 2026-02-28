module.exports.config = {
  name: "friend",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "SHAHADAT SAHU",
  description: "View and delete friends",
  commandCategory: "System",
  usages: "friend",
  cooldowns: 0,
  usePrefix: true
};

module.exports.handleReply = async function ({ api, handleReply, event }) {
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  let body = event.body.toLowerCase().trim();
  let msg = "";

  if (body === "del all") {
    for (let uid of handleReply.uidUser) {
      await api.unfriend(uid);
    }
    return api.sendMessage(`💥 ALL FRIENDS REMOVED 💥`, event.threadID, () =>
      api.unsendMessage(handleReply.messageID)
    );
  }

  const nums = body.split(" ").map(n => parseInt(n));

  for (let num of nums) {
    let name = handleReply.nameUser[num - 1];
    let uid = handleReply.uidUser[num - 1];

    await api.unfriend(uid);
    msg += `- ${name}\n`;
  }

  api.sendMessage(`💢Deleted Friends💢\n\n${msg}`, event.threadID, () =>
    api.unsendMessage(handleReply.messageID)
  );
};

module.exports.run = async function ({ event, api, args }) {
  try {
    const data = await api.getFriendsList();
    const total = data.length;

    let list = data.map(f => ({
      name: f.fullName || "No Name",
      uid: f.userID
    }));

    let page = parseInt(args[0]) || 1;
    if (page < 1) page = 1;

    let limit = args[0] === "all" ? list.length : 50; //list limit
    const totalPage = Math.ceil(list.length / limit);

    let msg = `🎭 FRIEND LIST (${total}) 🎭\n\n`;

    let nameUser = [], uidUser = [];
    let start = limit * (page - 1);
    let end = start + limit;

    for (let i = start; i < end; i++) {
      if (i >= list.length) break;

      let f = list[i];
      msg += `${i + 1}. ${f.name}\n\n`;

      nameUser.push(f.name);
      uidUser.push(f.uid);
    }

    msg += `═══════════════════════\n`;

    if (args[0] !== "all")
      msg += `Page ${page}/${totalPage}\nUse: friend <page>/all\n\n`;
    else
      msg += `Showing ALL Friends\n\n`;

    msg += `Reply number(s) to delete\nOr type: del all`;

    return api.sendMessage(msg, event.threadID, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID,
        nameUser,
        uidUser,
        type: "reply"
      });
    });

  } catch (e) {
    console.log(e);
  }
};