module.exports.config = {
	name: "god",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.0.0",
	credits: "SHAHADAT SAHU",
	description: "Record bot activity notifications!",
	envConfig: { enable: true }
};

module.exports.run = async function({ api, event, Threads, Users }) {

	if (!global.configModule[this.config.name].enable) return;

	const TID = "2330892037338385"; //replace your group id✅

	const threadID = event.threadID;
	const authorID = event.author;

	const threadData = await Threads.getData(threadID);
	const threadName = threadData.threadInfo?.threadName || "Unknown Group";
	const userName = await Users.getNameUser(authorID);

	let task = "";

	switch (event.logMessageType) {

		case "log:thread-name": {
			const oldName = threadData.threadInfo?.threadName || "Unknown";
			const newName = event.logMessageData.name || "Unknown";
			task = `গ্রুপের নাম পরিবর্তন করা হয়েছে
পুরনো নাম: ${oldName}
নতুন নাম: ${newName}`;
			break;
		}

		case "log:subscribe": {
			if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
				task = "বটকে নতুন গ্রুপে যুক্ত করা হয়েছে";
			}
			break;
		}

		case "log:unsubscribe": {
			if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
				task = "বটকে গ্রুপ থেকে রিমুভ করা হয়েছে";
			}
			break;
		}
	}

	if (!task) return;

	const report =
`✦•─•❁🌺 BOT ACTIVITY REPORT 🌺❁•─•✦

📛 গ্রুপ নাম: ${threadName}
🆔 থ্রেড আইডি: ${threadID}

👤 অ্যাকশন করেছে: ${userName}
🆔 ইউজার আইডি: ${authorID}

📌 অ্যাকশন:
${task}

⏳ সময়: ${new Date().toLocaleString()}`;

	return api.sendMessage(report, TID);
};