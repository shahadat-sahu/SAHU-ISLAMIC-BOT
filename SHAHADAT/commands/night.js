const fs = require("fs");

let cooldown = {};

module.exports.config = {
	name: "night",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "SHAHADAT SAHU",
	description: "Reply when someone says good night (anti-spam)",
	commandCategory: "no prefix",
	usages: "night",
	cooldowns: 5
};

module.exports.handleEvent = function({ api, event }) {
	const { threadID, messageID, body } = event;
	if (!body) return;

	const text = body.toLowerCase();

	if (
		text.startsWith("good night") ||
		text.startsWith("gud night") ||
		text.startsWith("gud nini")
	) {

		// Anti Spam (5 seconds per thread)
		if (cooldown[threadID] && Date.now() - cooldown[threadID] < 5000) {
			return; // ignore spam
		}

		cooldown[threadID] = Date.now();

		var msg = {
			body: "Good night না, আল্লাহ হাফেজ বলো প্রিয় 🥰",
			attachment: fs.createReadStream(__dirname + "/cache/night.jpg")
		};

		api.sendMessage(msg, threadID, messageID);
		api.setMessageReaction("😴", messageID, () => {}, true);
	}
};

module.exports.run = function() {};