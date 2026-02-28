module.exports.config = {
    name: "adduser",
    version: "1.0.1",
    hasPermission: 0,
    credits: "SHAHADAT SAHU",
    description: "Add user to group using profile link or UID",
    commandCategory: "system",
    usages: "[uid/link]",
    cooldowns: 5
};

const axios = require("axios");

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const out = msg => api.sendMessage(msg, threadID, messageID);

    if (!args[0]) return out("Please provide UID or Facebook profile link.");

    if (!isNaN(args[0])) {
        return addUserToGroup(args[0]);
    }

    let link = args[0];
    let uid = null;

    try {
        if (!link.includes("facebook.com") && !link.includes("fb.com"))
            return out("Please provide a valid Facebook profile link.");

        let res = await axios.get(link);
        let data = res.data;

        let match = data.match(/"userID":"(\d+)"/);
        if (match) uid = match[1];

        if (!uid) return out("Unable to extract UID from this link.");

        return addUserToGroup(uid);

    } catch (e) {
        return out("Failed to extract UID from the provided link.");
    }

    async function addUserToGroup(uid) {
        try {
            let info = await api.getThreadInfo(threadID);
            let participantIDs = info.participantIDs.map(e => parseInt(e));
            let admins = info.adminIDs.map(e => parseInt(e.id));
            let botID = parseInt(api.getCurrentUserID());

            uid = parseInt(uid);

            if (participantIDs.includes(uid))
                return out("This user is already in the group.");

            await api.addUserToGroup(uid, threadID);

            if (info.approvalMode === true && !admins.includes(botID))
                return out("User added to request list ✔️");

            return out("User successfully added ✔️");

        } catch (err) {
            return out("Unable to add this user.\nThe user might not be in friend list or privacy restricted.");
        }
    }
};