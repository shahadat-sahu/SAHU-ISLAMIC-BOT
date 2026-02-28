module.exports.config = {
	name: "setprefix",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "SHAHADAT SAHU",
	description: "Reset group prefix",
	commandCategory: "System",
	usages: "[prefix/reset]",
	cooldowns: 5
};

module.exports.languages = {
	"en": {
		"successChange": "Prefix successfully changed to: %1",
		"missingInput": "Prefix cannot be empty!",
		"resetPrefix": "Prefix reset to default: %1",
		"confirmChange": "Are you sure you want to change prefix to: %1?\nReact 👍 to confirm."
	}
};

module.exports.handleReaction = async function({ api, event, Threads, handleReaction, getText }) {
	if (event.userID != handleReaction.author) return;
	const data = (await Threads.getData(String(event.threadID))).data || {};
	data["PREFIX"] = handleReaction.PREFIX;
	await Threads.setData(event.threadID, { data });
	await global.data.threadData.set(String(event.threadID), data);
	api.unsendMessage(handleReaction.messageID);
	return api.sendMessage(
		getText("successChange", handleReaction.PREFIX),
		event.threadID,
		event.messageID
	);
};

module.exports.run = async ({ api, event, args, Threads, getText }) => {
	if (!args[0]) return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);

	let prefix = args[0].trim();
	if (!prefix) return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);

	if (prefix.toLowerCase() === "reset") {
		const data = (await Threads.getData(event.threadID)).data || {};
		data["PREFIX"] = global.config.PREFIX;

		await Threads.setData(event.threadID, { data });
		await global.data.threadData.set(String(event.threadID), data);

		return api.sendMessage(
			getText("resetPrefix", global.config.PREFIX),
			event.threadID,
			event.messageID
		);
	}

	return api.sendMessage(
		getText("confirmChange", prefix),
		event.threadID,
		(_, info) => {
			global.client.handleReaction.push({
				name: "setprefix",
				messageID: info.messageID,
				author: event.senderID,
				PREFIX: prefix
			});
		}
	);
};