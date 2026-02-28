module.exports.config = {
    name: "outall",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "SHAHADAT SAHU",
    description: "Bot leaves all groups",
    commandCategory: "Admin",
    usages: "",
    cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
    const { threadID } = event;
    const botID = api.getCurrentUserID();

    try {
        api.getThreadList(100, null, ["INBOX"], async (err, list) => {
            if (err) return api.sendMessage("❌ Failed to get group list.", threadID);

            let success = 0;
            let failed = 0;

            for (const item of list) {
                if (item.isGroup && item.threadID != threadID) {
                    try {
                        await api.removeUserFromGroup(botID, item.threadID);
                        success++;
                    } catch {
                        failed++;
                    }
                }
            }

            api.sendMessage(
                `✅ Left ${success} groups\n❌ Failed: ${failed}`,
                threadID
            );
        });
    } catch (error) {
        api.sendMessage("❌ Something went wrong.", threadID);
    }
};