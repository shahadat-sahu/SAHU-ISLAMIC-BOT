const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "wallpaper",
  version: "1.0.1",
  hasPermission: 0,
  credits: "Islamick Cyber Chat",
  description: "Search phone wallpaper",
  usages: "wallpaper [name]",
  commandCategory: "user",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {

  if (!args[0]) {
    return api.sendMessage(
      "🖼️ অনুগ্রহ করে একটি নাম লিখুন\nউদাহরণ: wallpaper nature 🌿",
      event.threadID,
      event.messageID
    );
  }

  api.setMessageReaction("🔍", event.messageID, () => {}, true);

  const apiKey = "39178311-acadeb32d7e369897e41dba06";
  const query = encodeURIComponent(args.join(" "));
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&per_page=20`;

  try {
    const response = await axios.get(apiUrl);
    const hits = response.data.hits;

    if (!hits || hits.length === 0) {
      return api.sendMessage(
        "❌ দুঃখিত, এই নামে কোনো ওয়ালপেপার পাওয়া যায়নি।",
        event.threadID,
        event.messageID
      );
    }

    let attachments = [];
    let count = 0;

    for (const item of hits) {
      if (count >= 5) break;

      const imageUrl = item.largeImageURL;
      const ext = path.extname(imageUrl);
      if (![".jpg", ".png"].includes(ext)) continue;

      const filePath = path.join(__dirname, `cache/wallpaper_${event.senderID}_${count}${ext}`);

      try {
        const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(img.data));
        attachments.push(
          fs.createReadStream(filePath).on("close", () => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          })
        );
        count++;
      } catch (e) {
        console.log("Image download error:", e.message);
      }
    }

    if (attachments.length === 0) {
      return api.sendMessage(
        "⚠️ ছবি লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        event.threadID,
        event.messageID
      );
    }

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    return api.sendMessage(
      {
        body: `📷 ${args.join(" ")} ওয়ালপেপার\n✨ আল্লাহর সৃষ্টি কত সুন্দর!`,
        attachment: attachments
      },
      event.threadID,
      event.messageID
    );

  } catch (error) {
    console.log(error);
    return api.sendMessage(
      "❌ সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।",
      event.threadID,
      event.messageID
    );
  }
};