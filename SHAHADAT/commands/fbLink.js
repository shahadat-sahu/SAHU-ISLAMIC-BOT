module.exports.config = {
	name: "fblink",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "SHAHADAT SAHU",
	description: "Get Facebook profile link",
	commandCategory: "Generate FB id link",
	cooldowns: 0
};

module.exports.run = async function({ api, event }) {

	const { threadID, messageID, senderID, mentions, type, messageReply } = event;

	if (Object.keys(mentions).length > 0) {
		for (let uid of Object.keys(mentions)) {
			api.sendMessage(
				`https://www.facebook.com/profile.php?id=${uid}`,
				threadID
			);
		}
		return;
	}

	if (type === "message_reply" && messageReply) {
		return api.sendMessage(
			`https://www.facebook.com/profile.php?id=${messageReply.senderID}`,
			threadID,
			messageID
		);
	}

	return api.sendMessage(
		`https://www.facebook.com/profile.php?id=${senderID}`,
		threadID,
		messageID
	);
};