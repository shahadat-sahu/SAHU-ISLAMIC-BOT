const axios = require("axios");

module.exports.config = {
  name: "ramadan",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Islamick Cyber",
  description: "This command provides Ramadan timings information for a given city.",
  commandCategory: "Religion",
  usages: "ramadan [city]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  try {
    if (!args[0]) {
      return api.sendMessage("Please provide a city/state name.", threadID, messageID);
    }

    const cityName = args.join(" ");
    const botName = global.config.BOTNAME || "Islamic Bot";

    api.setMessageReaction("⏰", messageID, () => {}, true);

    const apiUrl = `https://connect-foxapi.onrender.com/tools/ramadan?city=${encodeURIComponent(cityName)}&botName=${encodeURIComponent(botName)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.city) {
      return api.sendMessage(
        "City not found. Please check the spelling [don't use Direct 'country' name, use your city or state name ]",
        threadID,
        messageID
      );
    }

    const ramadanInfo =
"🌙 Ramadan Timings 🕌\n" +
"❏ City: " + data.city + "\n" +
"❏ Date: " + data.today.date + "\n" +
"❏ Hijri Date: " + data.hijriDate + "\n" +
"❏ Current Time: " + data.localTime + "\n\n" +
"Today's:\n" +
"❏ Sahr: " + data.today.sahr + "\n" +
"❏ Iftar: " + data.today.iftar + "\n\n" +
"Tomorrow:\n" +
"❏ Date: " + data.tomorrow.date + "\n" +
"❏ Sahr: " + data.tomorrow.sahr + "\n" +
"❏ Iftar: " + data.tomorrow.iftar + "\n\n" +
"❏ Note: 1 minute preventative difference in Sehri (-1 min) & Iftar (+1 min)";

    api.setMessageReaction("✅", messageID, () => {}, true);

    return api.sendMessage(ramadanInfo, threadID, messageID);

  } catch (error) {
    console.log(error);
    return api.sendMessage(
      "City not found. Please check the spelling [don't use Direct 'country' name, use your city or state name ]",
      threadID,
      messageID
    );
  }
};