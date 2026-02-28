const axios = require("axios");

module.exports.config = {
 name: "namaz",
 version: "2.0.0",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "Bangladesh Namaz Time (Any City)",
 commandCategory: "Islamic",
 usages: "namaz <city>",
 cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
 try {
 let location = args.join(" ");
 if (!location) location = "Dhaka,Bangladesh";

 const url = `http://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(location)}&method=1`;

 const res = await axios.get(url);
 const data = res.data.data;

 const t = data.timings;
 const date = data.date;

 const gregorianDate = date.readable;
 const hijriDate = date.hijri.date;
 const hijriMonth = date.hijri.month.en;

 let ramadanText = "";
 if (hijriMonth.toLowerCase() === "ramadan") {
 ramadanText = "\n🤲 Ramadan Mubarak";
 }

 const msg = `
🕌 NAMAZ TIME (${location})

📅 ${gregorianDate}
🌙 ${hijriDate}

Fajr : ${t.Fajr}
Sunrise : ${t.Sunrise}
Dhuhr : ${t.Dhuhr}
Asr : ${t.Asr}
Maghrib : ${t.Maghrib}
Isha : ${t.Isha}${ramadanText}
`;

 return api.sendMessage(msg, event.threadID, event.messageID);

 } catch (error) {
 return api.sendMessage("❌ Invalid city name or API error.", event.threadID, event.messageID);
 }
};