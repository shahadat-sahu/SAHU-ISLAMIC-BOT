module.exports.config = {
	name: "uid",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "SHAHADAT SAHU",
	description: "Get UID (self, mention, or reply)",
	commandCategory: "user",
	usages: "uid [tag/reply/none]",
	cooldowns: 0
};

module.exports.handleEvent = async function({ api, event, prefix }) {
	if (!event.body) return;

	const body = event.body.trim();
	const invokedCommand = body.split(" ")[0];

	const fileName = require("path").basename(__filename, ".js");

	const commandName = invokedCommand.startsWith(prefix || "") 
		? invokedCommand.slice((prefix || "").length) 
		: invokedCommand;

	if (commandName.toLowerCase() !== fileName) return;

	return getUID(api, event);
};

module.exports.run = async function({ api, event }) {
	const fileName = require("path").basename(__filename, ".js");
	const invokedCommand = event.body ? event.body.trim().split(" ")[0] : "";

	if (invokedCommand.replace(/^./, "") !== fileName && invokedCommand !== fileName) return;

	return getUID(api, event);
};

async function getUID(api, event) {
	let targetID;

	if (event.type === "message_reply" && event.messageReply) {
		targetID = event.messageReply.senderID;
	} else if (event.mentions && Object.keys(event.mentions).length > 0) {
		targetID = Object.keys(event.mentions)[0];
	} else {
		targetID = event.senderID;
	}

	await api.sendMessage(targetID, event.threadID, event.messageID);
}
