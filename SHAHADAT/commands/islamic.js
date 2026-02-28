module.exports.config = {
  name: "islamick",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Random Islamic video",
  commandCategory: "Random video",
  usages: "islamick",
  cooldowns: 2,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, event }) {

  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const links = [
    "https://i.imgur.com/FbnZI40.mp4",
    "https://i.imgur.com/8k6OOZg.mp4",
    "https://i.imgur.com/lgQghHX.mp4",
    "https://i.imgur.com/D7HZFSg.mp4",
    "https://i.imgur.com/vUe9Zlv.mp4",
    "https://i.imgur.com/oxFuJYw.mp4",
    "https://i.imgur.com/OKKlDBN.mp4",
    "https://i.imgur.com/6wWebFc.mp4",
    "https://i.imgur.com/K2LTmaA.mp4",
    "https://i.imgur.com/i9vKvTd.mp4",
    "https://i.imgur.com/Y6uBzxx.mp4",
    "https://i.imgur.com/ULtFVPQ.mp4",
    "https://i.imgur.com/wX8WJh3.mp4",
    "https://i.imgur.com/6A42EIx.mp4",
    "https://i.imgur.com/ozRevxt.mp4",
    "https://i.imgur.com/Gd49ZSo.mp4",
    "https://i.imgur.com/xu6lBXk.mp4",
    "https://i.imgur.com/sDNohv4.mp4",
    "https://i.imgur.com/JBu2Ie3.mp4",
    "https://i.imgur.com/UaY42rq.mp4",
    "https://i.imgur.com/NFxf731.mp4",
    "https://i.imgur.com/vv1HsMC.mp4",
    "https://i.imgur.com/Y8MPzLv.mp4",
    "https://i.imgur.com/9M1v1qK.mp4",
    "https://i.imgur.com/EgUy7v0.mp4",
    "https://i.imgur.com/IjDqg2G.mp4",
    "https://i.imgur.com/51NYqmO.mp4",
    "https://i.imgur.com/XjfJHh9.mp4",
    "https://i.imgur.com/XHrkPt4.mp4",
    "https://i.imgur.com/mqEYRdy.mp4",
    "https://i.imgur.com/NaVsFmQ.mp4",
    "https://i.imgur.com/31XSmVj.mp4",
    "https://i.imgur.com/PPamCPI.mp4",
    "https://i.imgur.com/i6Iy7iN.mp4"
  ];

  const randomLink = links[Math.floor(Math.random() * links.length)];
  const filePath = __dirname + "/cache/islamick.mp4";

  const caption = `🌿 Islamic Reminder 🌿

মানুষ হারাম ছাড়ে না অথচ সুখ শান্তি খুঁজে বেড়ায়।
মানুষ কেন বুঝতে চায় না —
সে যে খোদার গোলাম 🥺

আল্লাহ আমাদের সবাইকে হারাম থেকে দূরে থাকার তৌফিক দান করুন 🤲❤️`;

  const callback = () =>
    api.sendMessage(
      {
        body: caption,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );

  return request(encodeURI(randomLink))
    .pipe(fs.createWriteStream(filePath))
    .on("close", callback);
};