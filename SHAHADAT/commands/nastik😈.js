module.exports.config = {
    name: "nastik",
    version: "1.0.3",
    hasPermission: 2,
    credits: "SHAHADAT SAHU",
    description: "Tag a user to send insult messages",
    commandCategory: "without prefix",
    usages: "[@mention]",
    cooldowns: 0
};

module.exports.run = async function({ api, args, Users, event }) {
    const mentionedUserID = Object.keys(event.mentions)[0];
    
    if (!mentionedUserID) {
        return api.sendMessage("যেই নাস্তিক কে শিক্ষা দিতে চান তাকে মেনশন করুন 👿", event.threadID);
    }
    
    const mentionedUserName = event.mentions[mentionedUserID];
    const mentionsArray = [{ id: mentionedUserID, tag: mentionedUserName }];
    
    const sendMessage = (message) => api.sendMessage(message, event.threadID);
    
    sendMessage("বজ্জাত নাস্তিক");
    
    setTimeout(() => sendMessage({ body: "তর মতো ফাজিল পলা পাইন এই প্রথম দেখলাম-!!😈। " + mentionedUserName, mentions: mentionsArray }), 3000);
    setTimeout(() => sendMessage({ body: "টোকাই পলা পাইন-!!😹.. " + mentionedUserName, mentions: mentionsArray }), 5000);
    setTimeout(() => sendMessage({ body: "পালাইস নাহ পালাইস নাহ এমন ঠাপ দিমু পালানো জায়গায় পাবি না-!!😹 " + mentionedUserName, mentions: mentionsArray }), 3000);
    setTimeout(() => sendMessage({ body: "তোর চিকোন সুন্দরী বন কে উম্মাহ-!!😹💋 " + mentionedUserName, mentions: mentionsArray }), 5000);
    setTimeout(() => sendMessage({ body: "বারি বারি করবি তোর বউ রে নিয়ে খেলমু পাট খেতে নিয়ে-!!😹 " + mentionedUserName, mentions: mentionsArray }), 7000);
    setTimeout(() => sendMessage({ body: "নাস্তিকদের জায়গায় নাই তদের মতো নাস্তিক কে পেলে হাতে পায়ের রগ কেতে দিতাম-!!🩸🪓 " + mentionedUserName, mentions: mentionsArray }), 7000);
    setTimeout(() => sendMessage({ body: "দুরব চাওয়া মর তোর মতো ফাজিল আমাদের গ্রুপ এ থাকার যোগ্য-!!😹😈 " + mentionedUserName, mentions: mentionsArray }), 9000);
    setTimeout(() => sendMessage({ body: "আব্বা ডাক তাহলে মানুষ হবার ট্রিক বলে দিমু-!!😹 " + mentionedUserName, mentions: mentionsArray }), 9000);
    setTimeout(() => sendMessage({ body: "গালা গালি ৪২০ পাতার নাম পুদিনা তো মতো কা।লা পোলা পাইন চু**না-!!😈😹 " + mentionedUserName, mentions: mentionsArray }), 9000);
    setTimeout(() => sendMessage({ body: "কামলা পলা পাইন কামলা দিবি দে এতো নাটক কসর কেনো-!!😹 " + mentionedUserName, mentions: mentionsArray }), 12000);
    setTimeout(() => sendMessage({ body: "আর বাপের সাথে লাগতে আসবি-!!😾😈 " + mentionedUserName, mentions: mentionsArray }), 12000);
    setTimeout(() => sendMessage({ body: "হট করে দিমু তর বন রে তেরামি করবি তো-!!😹🥵। " + mentionedUserName, mentions: mentionsArray }), 12000);
    setTimeout(() => sendMessage({ body: "তুই তরা মা বাবার জারজ সন্তান-!!😈 " + mentionedUserName, mentions: mentionsArray }), 15000);
    setTimeout(() => sendMessage({ body: "ঠাপ খাবি বাপ চিনবি-!!😹😈 " + mentionedUserName, mentions: mentionsArray }), 15000);
    setTimeout(() => sendMessage({ body: "৯৯৯ এই নুম্বার এ কল দে তর বন রে কিডনাপ করমু-!!😹 " + mentionedUserName, mentions: mentionsArray }), 15000);
    setTimeout(() => sendMessage({ body: "বাপ চিনে লাগতে আসিস না হলে পরে আপসস করতে হবে-!!😈😹 " + mentionedUserName, mentions: mentionsArray }), 17000);
    setTimeout(() => sendMessage({ body: "তেরিং বেরিং করবি তো তর গুসঠি গারমু-!!😹🤬 " + mentionedUserName, mentions: mentionsArray }), 17000);
    setTimeout(() => sendMessage({ body: "তেরামি করবি গার মটকে দিবো-!!🤬😈 " + mentionedUserName, mentions: mentionsArray }), 17000);
    setTimeout(() => sendMessage({ body: "ফাইলাম করি ভালো কথা তুই তর বাপের সাথে লাগতে আসবি কেনো রে নাস্তিক-!!🤬😈 " + mentionedUserName, mentions: mentionsArray }), 20000);
    setTimeout(() => sendMessage({ body: "বারা বারি করবি তর বন রে নিয়ে পালাবো-!!🤧😈 " + mentionedUserName, mentions: mentionsArray }), 20000);
    setTimeout(() => sendMessage({ body: "গু খাওরা নাস্তিক-!!🤮😹 " + mentionedUserName, mentions: mentionsArray }), 20000);
    setTimeout(() => sendMessage({ body: "তুই এতো টা খারাপ যে তোকে দেখে জাহান্নাম ও ভয়ে কান্না করছে-!!🙂 " + mentionedUserName, mentions: mentionsArray }), 23000);
    setTimeout(() => sendMessage({ body: "বারা বারি করবি তোর মুখে হাইগ্যা দিমু-!!🤮😹 " + mentionedUserName, mentions: mentionsArray }), 23000);
    setTimeout(() => sendMessage({ body: "তেল মজামু আসিস-!!😹🤬 " + mentionedUserName, mentions: mentionsArray }), 23000);
    setTimeout(() => sendMessage({ body: "সময় থাকতে মানুষ হয়ে যা না হলে তরে আমাদের মানুষ করতে হবে-!!😈। " + mentionedUserName, mentions: mentionsArray }), 25000);
    setTimeout(() => sendMessage({ body: "পাকনাকি করবি গু এর সাগরে ডুবাইয়া মারমু-!!😹🤮 " + mentionedUserName, mentions: mentionsArray }), 25000);
    setTimeout(() => sendMessage({ body: "ওজান কুজাত এর জায়গা নাই আমার সহরে-!!🤬😈 " + mentionedUserName, mentions: mentionsArray }), 25000);
    setTimeout(() => sendMessage({ body: "ভিক্ষা করে তর জীবন চলে আর তুই আসছোট বাবাদের সাথে লাগতে-!!😈। " + mentionedUserName, mentions: mentionsArray }), 28500);
    setTimeout(() => sendMessage({ body: "তর রাতে আকাম করার ভিডিও ভাইরাল করে দিমু বারা বারি করবি তো-!!😹🤧 " + mentionedUserName, mentions: mentionsArray }), 28500);
    setTimeout(() => sendMessage({ body: "তর মতাও নাস্তিক আমাদের সাথে লাগতে আসছে বাহ-!!😹 " + mentionedUserName, mentions: mentionsArray }), 28500);
    setTimeout(() => sendMessage({ body: "দিন রাত হাত মাইরা বলস তুই পাপি নাহ তুই ভালো মানুষ-!!😹 " + mentionedUserName, mentions: mentionsArray }), 31000);
    setTimeout(() => sendMessage({ body: "বেয়াদব দের সাথে কথা বলতে চাই না দূরে যাইয়া মর-!!🤧🤮 " + mentionedUserName, mentions: mentionsArray }), 31000);
    setTimeout(() => sendMessage({ body: "নাস্তিক এর বাচ্চা হিজলার সাথে তার কাতা-!!🤬🥵 " + mentionedUserName, mentions: mentionsArray }), 31000);
    setTimeout(() => sendMessage({ body: "টোকাই পলা পাইন আমাদের ডাস্টবিনের ময়লা আবর্জনা টুকিয়ে তর জীবন চলে আর তুই আমাদের উপরে আসস কথা বলতে-!!😹 " + mentionedUserName, mentions: mentionsArray }), 36000);
    setTimeout(() => sendMessage({ body: "বেশি কাহিনি করবি তর বন রে নিয়ে কাহিনি বানিয়ে দিমু-!!😹 " + mentionedUserName, mentions: mentionsArray }), 36000);
    setTimeout(() => sendMessage({ body: "নাস্তিক এর বাচ্চা এমন ঠাপ দিমু তোর বন রে শুধা লারাইয়া ফেলমু-!!😈🤬 " + mentionedUserName, mentions: mentionsArray }), 36000);
    setTimeout(() => sendMessage("থাপ্পর খাবি তো বাপ চিনবি-!!😹"), 39000);
    setTimeout(() => sendMessage("তুই কই তর বন এর টুনটুনি সই-!!😹🥵"), 39000);
    setTimeout(() => sendMessage("তেরিং বেতিং করবি তোর বন এর জৌবন নষ্ট করে দিমু-!!🥵😹"), 39000);
    setTimeout(() => sendMessage({ body: "ভিক্ষা মাইংগা খাস আবার বড়ো বড়ো কথা বলস সরম করে নাহ নাস্তিক-!!😹। " + mentionedUserName, mentions: mentionsArray }), 42000);
    setTimeout(() => sendMessage("তর মার সাথে রাতে আকাম করগা ভালো না লাগলে-!!🥵🤬"), 40000);
    setTimeout(() => sendMessage("কিং অফ ফকিন্নির পলা-!!✌️😈 "), 41000);
    setTimeout(() => sendMessage("next time লাগতে আসার আগে ১০ বার ভাবিস-!!🤬😈 "), 41000);
    setTimeout(() => sendMessage("কিং অফ ঘু খোর টোকাই পোলা-!!✌️😈 "), 42000);
    setTimeout(() => sendMessage({ body: "আমার ইসলাম এর সাথে লাগতে আসিস নাহ তোর জীবন এক থাপ্পড়ে শেষ করে দিবো " + mentionedUserName, mentions: mentionsArray }), 48000);
    setTimeout(() => sendMessage({ body: "তর মতো নাস্তিক আমাদের পা চেটে খায় আর তুই আমাদের সাথে লাগতে আসোস-!!😹😈 " + mentionedUserName, mentions: mentionsArray }), 51000);
    setTimeout(() => sendMessage({ body: "আমাদের নামে উল্টো পালটা কথা বইলা তর জীবন নিয়ে টানা টানি করিস নাহ-!!😹 " + mentionedUserName, mentions: mentionsArray }), 54000);
    setTimeout(() => sendMessage({ body: "আমাদের পা চেটে খাওয়া পোলা পাইন আমাদের সাথে লাগতে আসবি-!!😈🤬 " + mentionedUserName, mentions: mentionsArray }), 57000);
    setTimeout(() => sendMessage({ body: "বাইমানি করি তাও আবার আমাদের সাথে তর নাম পরিবর্তন করে দিমু আসিস আমাদের এই খানে-!!😹 " + mentionedUserName, mentions: mentionsArray }), 59400);
    setTimeout(() => sendMessage({ body: "দিন রাত নেসা পানি খারাপ কাজ করে তুই বলিস মুমিন বান্দা-!!😹 " + mentionedUserName, mentions: mentionsArray }), 63000);
    setTimeout(() => sendMessage({ body: "তর মতো নাফরমানি বান্ধা আমাদের বাল এর জজ্ঞ নাহ-!!😹 " + mentionedUserName, mentions: mentionsArray }), 66000);
    setTimeout(() => sendMessage({ body: "তুই খারাপ কাজ করে আমাদের সাথে লাগতে আসবি তর হার গুরো করে দিবো-!!🦴😹 " + mentionedUserName, mentions: mentionsArray }), 69000);
    setTimeout(() => sendMessage({ body: "গালা গালি করবি তো মুখ শিলাই করে দিমহ-!!😁😷। " + mentionedUserName, mentions: mentionsArray }), 72000);
    setTimeout(() => sendMessage({ body: "তোর মুখে ভাতরুমের গন্ধ যা আগে দাত মেঝে আয় পরে কথা বলিস-!!😁 " + mentionedUserName, mentions: mentionsArray }), 75000);
    setTimeout(() => sendMessage({ body: "তুই লাগবি আমাদের সাথে আসিস তোর জা আছে এখন পরে তা নিয়েও ফিরতে পারবি নাহ-!!😁 " + mentionedUserName, mentions: mentionsArray }), 81000);
    setTimeout(() => sendMessage({ body: "বাস্ট্রাড এর বাচ্ছা বস্তির পোলা-!!🤧🤮 " + mentionedUserName, mentions: mentionsArray }), 87000);
    setTimeout(() => sendMessage("তর মা বাবার জারজ শন্তান-!!🤬😈"), 93000);
    setTimeout(() => sendMessage({ body: "তর মতো নাস্তিক পশুর থেকে নিক্রিসঠো-!!😈 " + mentionedUserName, mentions: mentionsArray }), 99000);
    setTimeout(() => sendMessage({ body: "তর জন্মদাতা রাস্তার কুত্তা-!!🤧😹 " + mentionedUserName, mentions: mentionsArray }), 105000);
    setTimeout(() => sendMessage({ body: "তুই কিত্তা তাই কুত্তার মতো শুধু গেও গেও করস-!!😹 " + mentionedUserName, mentions: mentionsArray }), 111000);
    setTimeout(() => sendMessage({ body: "তোর হয়তো জানা নেই ইসলাম কি জিনিস ইসলাম এর পাওয়ার কতো টুকু-!!😎⚡⛈️ " + mentionedUserName, mentions: mentionsArray }), 114000);
    setTimeout(() => sendMessage({ body: "সেই দিন কার কামলা পলা পাইন-!!😁 " + mentionedUserName, mentions: mentionsArray }), 120000);
    setTimeout(() => sendMessage({ body: "জুয়ারি গাঞ্জুটি পোলা পাইন ইসলামিক গ্রুপ এ থাকার জজ্ঞ নাহ-!!🤬 " + mentionedUserName, mentions: mentionsArray }), 126000);
    setTimeout(() => sendMessage({ body: "বস্তির ছেলে অনলাইনের কিং-!!😹 " + mentionedUserName, mentions: mentionsArray }), 132000);
    setTimeout(() => sendMessage({ body: "তুই টোকাই কিং-!!😹 " + mentionedUserName, mentions: mentionsArray }), 138000);
    setTimeout(() => sendMessage({ body: "টাকার অভাবে মরা গরু খাস-!!😹 " + mentionedUserName, mentions: mentionsArray }), 144000);
    setTimeout(() => sendMessage({ body: "টোকাই সেলিব্রেটি-!!😹 " + mentionedUserName, mentions: mentionsArray }), 150000);
    setTimeout(() => sendMessage({ body: "ভাত খাইবার ভাত পাস না আর কথা বলতে আসোস আমাদের সাথে-!!😹 " + mentionedUserName, mentions: mentionsArray }), 156000);
    setTimeout(() => sendMessage({ body: "ফকিন্নি পোলাপান-!!😹 " + mentionedUserName, mentions: mentionsArray }), 162000);
    setTimeout(() => sendMessage({ body: "বস্তিরন্দালাল এর বাচ্ছা বস্তির পোলা-!!😹 " + mentionedUserName, mentions: mentionsArray }), 168000);
    setTimeout(() => sendMessage("জারজ শন্তান জা ভাগ-!!😹😈"), 171000);
    setTimeout(() => sendMessage({ body: "hare is বস্তি পোলা-!!😹 " + mentionedUserName, mentions: mentionsArray }), 174000);
    setTimeout(() => sendMessage({ body: "বান্তেয়ামি করার জায়গা পাস না-!!🤬 " + mentionedUserName, mentions: mentionsArray }), 177000);
    setTimeout(() => sendMessage({ body: "লাগতে আসিস নাহ ভারচুয়াল জগত হারাম করে দিমু-!!🤬😈 " + mentionedUserName, mentions: mentionsArray }), 180000);
};
