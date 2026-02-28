module.exports.config = {
	name: "self",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "SHAHADAT SAHU",
	description: "Manage bot admin",
	commandCategory: "config",
	usages: "[list/add/remove] [@mention/reply/uid]",
	cooldowns: 0,
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.run = async function ({ api, event, args, Users, permssion }) {

	const { threadID, messageID, mentions, messageReply } = event;
	const { configPath } = global.client;
	const { writeFileSync } = global.nodemodule["fs-extra"];

	delete require.cache[require.resolve(configPath)];
	let config = require(configPath);

	if (!config.ADMINBOT) config.ADMINBOT = [];
	if (!global.config.ADMINBOT) global.config.ADMINBOT = config.ADMINBOT;

	const getUID = () => {
		if (Object.keys(mentions).length > 0)
			return Object.keys(mentions);

		if (messageReply)
			return [messageReply.senderID];

		if (!isNaN(args[1]))
			return [args[1]];

		return [];
	};

	switch (args[0]) {

		case "list":
		case "all":
		case "-a": {
			if (!config.ADMINBOT.length)
				return api.sendMessage("No admin found.", threadID, messageID);

			let msg = [];
			for (const id of config.ADMINBOT) {
				const name = await Users.getNameUser(id);
				msg.push(`- ${name} (${id})`);
			}

			return api.sendMessage("Admin List:\n\n" + msg.join("\n"), threadID, messageID);
		}

		case "add": {
			if (permssion != 2)
				return api.sendMessage("You don't have permission.", threadID, messageID);

			let uids = getUID();
			if (!uids.length)
				return api.sendMessage("Mention, reply or give UID.", threadID, messageID);

			let added = [];

			for (const id of uids) {
				if (!config.ADMINBOT.includes(id)) {
					config.ADMINBOT.push(id);
					const name = await Users.getNameUser(id);
					added.push(`${name} (${id})`);
				}
			}

			writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
			return api.sendMessage(`Added ${added.length} Admin:\n\n${added.join("\n")}`, threadID, messageID);
		}

		case "remove":
		case "rm":
		case "delete": {
			if (permssion != 2)
				return api.sendMessage("You don't have permission.", threadID, messageID);

			let uids = getUID();
			if (!uids.length)
				return api.sendMessage("Mention, reply or give UID.", threadID, messageID);

			let removed = [];

			for (const id of uids) {
				const index = config.ADMINBOT.indexOf(id);
				if (index !== -1) {
					config.ADMINBOT.splice(index, 1);
					const name = await Users.getNameUser(id);
					removed.push(`${name} (${id})`);
				}
			}

			writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
			return api.sendMessage(`Removed ${removed.length} Admin:\n\n${removed.join("\n")}`, threadID, messageID);
		}

		default:
			return api.sendMessage("Usage:\nself list\nself add @mention / reply / uid\nself remove @mention / reply / uid", threadID, messageID);
	}
};