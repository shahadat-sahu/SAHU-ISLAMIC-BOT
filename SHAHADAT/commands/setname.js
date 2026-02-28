module.exports.config = {
	name: "name",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "SHAHADAT SAHU",
	description: "Change nickname by reply or self",
	commandCategory: "Box Chat",
	usages: "/name [new name] or /name [new name] self",
	cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {

	const { threadID, senderID, messageReply } = event;

	if (!args[0]) 
		return api.sendMessage("Please enter a name.", threadID);

	let newName = args.join(" ").trim();
	let targetID;

	if (args[args.length - 1].toLowerCase() === "self") {
		newName = args.slice(0, -1).join(" ").trim();
		targetID = senderID;
	}
	else if (messageReply) {
		targetID = messageReply.senderID;
	}
	else {
		targetID = senderID;
	}

	if (!newName)
		return api.sendMessage("Nickname cannot be empty.", threadID);

	try {
		await api.changeNickname(newName, threadID, targetID);
		api.sendMessage("✅ Nickname updated successfully.", threadID);
	} catch (err) {
		api.sendMessage("❌ Failed to change nickname.", threadID);
	}
};