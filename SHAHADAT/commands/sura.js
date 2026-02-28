module.exports.config = {
  name: "sura",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Islamick Chat",
  description: "প্রিয় মুসলিম ভাই ও বন তুমাদের জন্য সূরা নিয়ে আসলাম",
  commandCategory: "M H BD",
  usages: "sura",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const cachePath = __dirname + "/cache";
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

  const caption = "•┄┅════❁🌺❁════┅┄•\n\nপ্রিয় মুসলিম |ভাই ও বন| সূরা টি শুনো তুমার প্রান জুরিয়ে যাবে \n\n ইনশাআল্লাহ ❤️🌸 \n\n•┄┅════❁🌺❁════┅┄•";

  const links = [
    "https://drive.google.com/uc?id=1Ml6znasS_cajYJVS8OJ19DQO6aaLzWkc",
    "https://drive.google.com/uc?id=1NKyRitWSGriX3TG23YTLj0tgfySwn6Q-",
    "https://drive.google.com/uc?id=1N-sbqx4LjEc-OOEa0MXhM2crzyvn3ynj",
    "https://drive.google.com/uc?id=1N9AzB4zAWlz2bG3UesZ7GawyJykRO79s",
    "https://drive.google.com/uc?id=1MrLaZG9NyfSDLjZvCRK69L0nnepV6R7U",
    "https://drive.google.com/uc?id=1N7W-i_Xr3lxM0cvv4dQlGUvsFGoyHnIl",
    "https://drive.google.com/uc?id=1Mn8JXddjoYKHkNcgAdnw8dnwhr2Ems6s",
    "https://drive.google.com/uc?id=1NLbrtpig80X1_NTlRHmeKG7ZQPtTmdTJ",
    "https://drive.google.com/uc?id=1NFnzqXl8aC_9tpngoKcfeWEyyT3DNdGW",
    "https://drive.google.com/uc?id=1NAkALvze0fkzkRvzDSTQvt-nqCIqqQBv",
    "https://drive.google.com/uc?id=1NFrEbcdP3CnZ1ZB1KKDCDa6gpV5x4W4t",
    "https://drive.google.com/uc?id=1MpowaaCScbWY-vEGtfLX5xPzKCQineHl",
    "https://drive.google.com/uc?id=1N3bT2YWhp92xABdf851LDuELwwc1b92T"
  ];

  const randomLink = links[Math.floor(Math.random() * links.length)];
  const filePath = cachePath + "/sura.mp3";

  request(encodeURI(randomLink))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => {
      api.sendMessage(
        {
          body: caption,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );
    })
    .on("error", () => {
      api.sendMessage("⚠️ সূরা লোড করতে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
    });
};