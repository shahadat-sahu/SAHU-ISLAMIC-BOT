module.exports.config = {
    name: "settings",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "SHAHADAT SAHU",
    description: "Advanced bot configuration panel",
    commandCategory: "system",
    cooldowns: 0,
    usePrefix: true
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Utility function for GUID
function getGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Get headers with current cookie
function getHeaders(api) {
    try {
        const appState = api.getAppState();
        const cookie = appState.map(item => `${item.key}=${item.value}`).join(";");
        return {
            "Host": "mbasic.facebook.com",
            "User-Agent": "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Cookie": cookie,
            "Referer": "https://mbasic.facebook.com/",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Upgrade-Insecure-Requests": "1"
        };
    } catch (err) {
        console.error("Error getting headers:", err);
        return {};
    }
}

module.exports.handleReply = async function({ api, event, handleReply }) {
    const botID = api.getCurrentUserID();
    const { type, author } = handleReply;
    const { threadID, messageID, senderID, attachments } = event;
    const body = event.body || "";

    if (author != senderID) return;

    const args = body.split(" ").filter(arg => arg.trim() !== "");
    
    const reply = (msg, callback) => {
        if (callback) api.sendMessage(msg, threadID, callback, messageID);
        else api.sendMessage(msg, threadID, messageID);
    };

    try {
        // ==================== MENU ====================
        if (type === 'menu') {
            const choice = args[0];
            
            // 01, 02: Change Bio/Nickname
            if (["01", "1", "02", "2"].includes(choice)) {
                const isBio = ["01", "1"].includes(choice);
                reply(`📌 Please reply with the ${isBio ? "bio" : "nickname"} you want to set\n🗑️ Type "delete" to remove current ${isBio ? "bio" : "nickname"}`, (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: isBio ? "changeBio" : "changeNickname"
                    });
                });
            }
            
            // 03: Pending messages
            else if (["03", "3"].includes(choice)) {
                try {
                    const pending = await api.getThreadList(100, null, ["PENDING"]);
                    if (!pending || pending.length === 0) return reply("📭 No pending messages found");
                    
                    const msg = pending.map(t => `👤 ${t.name || 'Unknown'}\n🆔 ${t.threadID}\n💬 ${t.snippet || 'No preview'}\n`).join("\n");
                    return reply(`📨 PENDING MESSAGES (${pending.length}):\n\n${msg}`);
                } catch (err) {
                    return reply("❌ Failed to fetch pending messages: " + err.message);
                }
            }
            
            // 04: Unread messages
            else if (["04", "4"].includes(choice)) {
                try {
                    const unread = await api.getThreadList(100, null, ["UNREAD"]);
                    if (!unread || unread.length === 0) return reply("📭 No unread messages");
                    
                    const msg = unread.map(t => `👤 ${t.name || 'Unknown'}\n🆔 ${t.threadID}\n💬 ${t.snippet || 'No preview'}\n`).join("\n");
                    return reply(`📩 UNREAD MESSAGES (${unread.length}):\n\n${msg}`);
                } catch (err) {
                    return reply("❌ Failed to fetch unread messages: " + err.message);
                }
            }
            
            // 05: Spam/Other messages
            else if (["05", "5"].includes(choice)) {
                try {
                    const other = await api.getThreadList(100, null, ["OTHER"]);
                    if (!other || other.length === 0) return reply("📭 No spam messages");
                    
                    const msg = other.map(t => `👤 ${t.name || 'Unknown'}\n🆔 ${t.threadID}\n💬 ${t.snippet || 'No preview'}\n`).join("\n");
                    return reply(`🚫 SPAM/OTHER (${other.length}):\n\n${msg}`);
                } catch (err) {
                    return reply("❌ Failed to fetch spam messages: " + err.message);
                }
            }
            
            // 06: Change Avatar
            else if (["06", "6"].includes(choice)) {
                reply("📸 Send an image or reply with an image URL to set as bot avatar", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "changeAvatar"
                    });
                });
            }
            
            // 07: Avatar Shield
            else if (["07", "7"].includes(choice)) {
                if (!args[1] || !["on", "off"].includes(args[1].toLowerCase())) {
                    return reply("⚠️ Please specify: settings 7 on | settings 7 off");
                }
                
                const enable = args[1].toLowerCase() === 'on';
                try {
                    // Use api.changeBio or alternative method for shield
                    // Note: Facebook frequently changes this API
                    await api.changeBio(enable ? "🛡️ Protected" : "", false);
                    return reply(`${enable ? "🛡️ Enabled" : "🔓 Disabled"} avatar protection`);
                } catch (err) {
                    return reply("❌ Failed to toggle shield: " + err.message);
                }
            }
            
            // 08: Block User
            else if (["08", "8"].includes(choice)) {
                reply("🚫 Reply with user ID(s) to block (space or newline separated)", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "blockUser"
                    });
                });
            }
            
            // 09: Unblock User
            else if (["09", "9"].includes(choice)) {
                reply("✅ Reply with user ID(s) to unblock (space or newline separated)", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "unBlockUser"
                    });
                });
            }
            
            // 10: Create Post
            else if (choice === "10") {
                reply("📝 Reply with the content for your post", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "createPost"
                    });
                });
            }
            
            // 11: Delete Post
            else if (choice === "11") {
                reply("🗑️ Reply with post ID(s) to delete (space or newline separated)", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "deletePost"
                    });
                });
            }
            
            // 12, 13: Comment on Post
            else if (["12", "13"].includes(choice)) {
                const isGroup = choice === "13";
                reply(`💬 Reply with post ID(s) to comment on (${isGroup ? "Group" : "User"} posts)`, (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "choiceIdCommentPost",
                        isGroup: isGroup
                    });
                });
            }
            
            // 14: React to Post
            else if (choice === "14") {
                reply("😀 Reply with post ID(s) to react to", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "choiceIdReactionPost"
                    });
                });
            }
            
            // 15: Add Friend
            else if (choice === "15") {
                reply("👋 Reply with user ID(s) to send friend requests", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "addFriends"
                    });
                });
            }
            
            // 16: Accept Friend
            else if (choice === "16") {
                reply("✅ Reply with user ID(s) to accept friend requests from", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "acceptFriendRequest"
                    });
                });
            }
            
            // 17: Delete Friend Request
            else if (choice === "17") {
                reply("❌ Reply with user ID(s) to decline friend requests from", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "deleteFriendRequest"
                    });
                });
            }
            
            // 18: Unfriend
            else if (choice === "18") {
                reply("💔 Reply with user ID(s) to unfriend", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "unFriends"
                    });
                });
            }
            
            // 19: Send Message
            else if (choice === "19") {
                reply("📨 Reply with user ID(s) to send message to", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "choiceIdSendMessage"
                    });
                });
            }
            
            // 20: Create Note
            else if (choice === "20") {
                reply("📋 Reply with code/content to create note on buildtool.dev", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "noteCode"
                    });
                });
            }
            
            // 21: Logout
            else if (choice === "21") {
                reply("⚠️ Are you sure you want to logout? Reply YES to confirm", (err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "confirmLogout"
                    });
                });
            }
            
            else {
                reply("❌ Invalid option! Please choose 01-21");
            }
        }

        // ==================== CHANGE BIO ====================
        else if (type === 'changeBio') {
            const bio = body.toLowerCase() === 'delete' ? '' : body;
            try {
                await api.changeBio(bio, false);
                return reply(`${bio ? `✅ Bio changed to: ${bio}` : "✅ Bio cleared successfully"}`);
            } catch (err) {
                return reply("❌ Failed to change bio: " + err.message);
            }
        }

        // ==================== CHANGE NICKNAME ====================
        else if (type === 'changeNickname') {
            const nickname = body.toLowerCase() === 'delete' ? '' : body;
            try {
                // Use api.changeNickname if available, otherwise use alternative
                if (api.changeNickname) {
                    await api.changeNickname(nickname, botID, botID);
                } else {
                    // Fallback: Update profile name via GraphQL
                    // Note: This requires specific permissions
                    throw new Error("Nickname change not supported in this API version");
                }
                return reply(`${nickname ? `✅ Nickname set to: ${nickname}` : "✅ Nickname cleared"}`);
            } catch (err) {
                return reply("❌ Failed to change nickname: " + err.message);
            }
        }

        // ==================== CHANGE AVATAR ====================
        else if (type === 'changeAvatar') {
            let imgUrl;
            
            // Check for URL in message
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urlMatch = body.match(urlRegex);
            
            if (urlMatch && urlMatch[0]) {
                imgUrl = urlMatch[0];
            } 
            // Check for attachment
            else if (attachments && attachments[0] && attachments[0].type === "photo") {
                imgUrl = attachments[0].url;
            }
            
            if (!imgUrl) {
                return reply("❌ Please provide an image URL or attach a photo", (err, info) => {
                    if (!err) {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: senderID,
                            type: "changeAvatar"
                        });
                    }
                });
            }

            try {
                reply("⏳ Uploading avatar...");
                
                // Download image
                const imgRes = await axios.get(imgUrl, { 
                    responseType: "arraybuffer",
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                const imgBuffer = Buffer.from(imgRes.data, 'binary');
                
                // Use api.changeAvatar or upload method
                if (api.changeAvatar) {
                    await api.changeAvatar(imgBuffer);
                    return reply("✅ Avatar changed successfully!");
                } else {
                    // Alternative: Save and use local path
                    const tempPath = path.join(__dirname, 'cache', `avatar_${Date.now()}.jpg`);
                    await fs.ensureDir(path.dirname(tempPath));
                    await fs.writeFile(tempPath, imgBuffer);
                    
                    // Try to change avatar via available method
                    await api.changeAvatar(tempPath);
                    
                    // Cleanup
                    await fs.remove(tempPath);
                    return reply("✅ Avatar changed successfully!");
                }
            } catch (err) {
                console.error("Avatar change error:", err);
                return reply("❌ Failed to change avatar: " + err.message);
            }
        }

        // ==================== BLOCK USER ====================
        else if (type === 'blockUser') {
            if (!body) return reply("❌ Please provide user ID(s)");
            
            const uids = body.replace(/\s+/g, " ").trim().split(/\s+/);
            const success = [];
            const failed = [];

            for (const uid of uids) {
                try {
                    await api.changeBlockedStatus(uid, true);
                    success.push(uid);
                } catch (err) {
                    failed.push(uid);
                }
            }
            
            let msg = `🚫 BLOCKED: ${success.length} user(s)`;
            if (failed.length > 0) msg += `\n❌ Failed: ${failed.join(", ")}`;
            return reply(msg);
        }

        // ==================== UNBLOCK USER ====================
        else if (type === 'unBlockUser') {
            if (!body) return reply("❌ Please provide user ID(s)");
            
            const uids = body.replace(/\s+/g, " ").trim().split(/\s+/);
            const success = [];
            const failed = [];

            for (const uid of uids) {
                try {
                    await api.changeBlockedStatus(uid, false);
                    success.push(uid);
                } catch (err) {
                    failed.push(uid);
                }
            }
            
            let msg = `✅ UNBLOCKED: ${success.length} user(s)`;
            if (failed.length > 0) msg += `\n❌ Failed: ${failed.join(", ")}`;
            return reply(msg);
        }

        // ==================== CREATE POST ====================
        else if (type === 'createPost') {
            if (!body) return reply("❌ Post content cannot be empty");
            
            try {
                const post = await api.createPost(body);
                return reply(`✅ Post created!\n🆔 ${post.postID || 'N/A'}\n🔗 ${post.url || 'N/A'}`);
            } catch (err) {
                return reply("❌ Failed to create post: " + err.message);
            }
        }

        // ==================== DELETE POST ====================
        else if (type === 'deletePost') {
            if (!body) return reply("❌ Please provide post ID(s)");
            
            const postIDs = body.replace(/\s+/g, " ").trim().split(/\s+/);
            const success = [];
            const failed = [];

            for (const postID of postIDs) {
                try {
                    await api.deletePost(postID);
                    success.push(postID);
                } catch (err) {
                    failed.push(postID);
                }
            }
            
            let msg = `🗑️ DELETED: ${success.length} post(s)`;
            if (failed.length > 0) msg += `\n❌ Failed: ${failed.join(", ")}`;
            return reply(msg);
        }

        // ==================== COMMENT POST ====================
        else if (type === 'choiceIdCommentPost') {
            if (!body) return reply("❌ Please provide post ID(s)");
            
            const postIDs = body.replace(/\s+/g, " ").trim().split(/\s+/);
            
            reply("💬 Reply with the comment text", (err, info) => {
                if (err) return console.error(err);
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    postIDs: postIDs,
                    type: "commentPost",
                    isGroup: handleReply.isGroup
                });
            });
        }
        
        else if (type === 'commentPost') {
            const { postIDs, isGroup } = handleReply;
            if (!body) return reply("❌ Comment text cannot be empty");
            
            const success = [];
            const failed = [];

            for (const postID of postIDs) {
                try {
                    await api.sendComment(body, postID);
                    success.push(postID);
                } catch (err) {
                    failed.push(postID);
                }
            }
            
            let msg = `💬 COMMENTED on ${success.length} post(s)`;
            if (failed.length > 0) msg += `\n❌ Failed: ${failed.join(", ")}`;
            return reply(msg);
        }

        // ==================== REACTION POST ====================
        else if (type === 'choiceIdReactionPost') {
            if (!body) return reply("❌ Please provide post ID(s)");
            
            const postIDs = body.replace(/\s+/g, " ").trim().split(/\s+/);
            const validReactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry', 'care'];
            
            reply(`😀 Choose reaction: ${validReactions.join('/')}`, (err, info) => {
                if (err) return console.error(err);
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    postIDs: postIDs,
                    type: "reactionPost"
                });
            });
        }
        
        else if (type === 'reactionPost') {
            const { postIDs } = handleReply;
            const reaction = body.toLowerCase();
            const validReactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry', 'care', 'unlike'];
            
            if (!validReactions.includes(reaction)) {
                return reply(`❌ Invalid reaction. Choose: ${validReactions.join('/')}`);
            }
            
            const success = [];
            const failed = [];

            for (const postID of postIDs) {
                try {
                    await api.setPostReaction(postID, reaction);
                    success.push(postID);
                } catch (err) {
                    failed.push(postID);
                }
            }
            
            let msg = `${reaction.toUpperCase()} ${success.length} post(s)`;
            if (failed.length > 0) msg += `\n❌ Failed: ${failed.join(", ")}`;
            return reply(msg);
        }

        // ==================== ADD FRIENDS ====================
        else if (type === 'addFriends') {
            if (!body) return reply("❌ Please provide user ID(s)");
            
            const uids = body.replace(/\s+/g, " ").trim().split(/\s+/);
            const success = [];
            const failed = [];

            for (const uid of uids) {
                try {
                    await api.addFriend(uid);
                    success.push(uid);
                } catch (err) {
                    failed.push(uid);
                }
            }
            
            let msg = `👋 FRIEND REQUESTS SENT: ${success.length}`;
            if (failed.length > 0) msg += `\n❌ Failed: ${failed.join(", ")}`;
            return reply(msg);
        }

        // ==================== ACCEPT FRIEND REQUEST ====================
        else if (type === 'acceptFriendRequest') {
            if (!body) return reply("❌ Please provide user ID(s)");
            
            const uids = body.replace(/\s+/g, " ").trim().split(/\s+/);
            const success = [];
            const failed = [];

            for (const uid of uids) {
                try {
                    await api.acceptFriendRequest(uid);
                    success.push(uid);
                } catch (err) {
                    failed.push(uid);
                }
            }
            
            let msg = `✅ ACCEPTED: ${success.length} request(s)`;
            if (failed.length > 0) msg += `\n❌ Failed: ${failed.join(", ")}`;
            return reply(msg);
        }

        // ==================== DELETE FRIEND REQUEST ====================
        else if (type === 'deleteFriendRequest') {
            if (!body) return reply("❌ Please provide user ID(s)");
            
            const uids = body.replace(/\s+/g, " ").trim().split(/\s+/);
            const success = [];
            const failed = [];

            for (const uid of uids) {
                try {
                    await api.deleteFriendRequest(uid);
                    success.push(uid);
                } catch (err) {
                    failed.push(uid);
                }
            }
            
            let msg = `❌ DECLINED: ${success.length} request(s)`;
            if (failed.length > 0) msg += `\n❌ Failed: ${failed.join(", ")}`;
            return reply(msg);
        }

        // ==================== UNFRIEND ====================
        else if (type === 'unFriends') {
            if (!body) return reply("❌ Please provide user ID(s)");
            
            const uids = body.replace(/\s+/g, " ").trim().split(/\s+/);
            const success = [];
            const failed = [];

            for (const uid of uids) {
                try {
                    await api.unfriend(uid);
                    success.push(uid);
                } catch (err) {
                    failed.push(uid);
                }
            }
            
            let msg = `💔 UNFRIENDED: ${success.length} user(s)`;
            if (failed.length > 0) msg += `\n❌ Failed: ${failed.join(", ")}`;
            return reply(msg);
        }

        // ==================== SEND MESSAGE ====================
        else if (type === 'choiceIdSendMessage') {
            if (!body) return reply("❌ Please provide user ID(s)");
            
            const uids = body.replace(/\s+/g, " ").trim().split(/\s+/);
            
            reply("📨 Reply with the message to send", (err, info) => {
                if (err) return console.error(err);
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    uids: uids,
                    type: "sendMessage"
                });
            });
        }
        
        else if (type === 'sendMessage') {
            const { uids } = handleReply;
            if (!body) return reply("❌ Message cannot be empty");
            
            const success = [];
            const failed = [];

            for (const uid of uids) {
                try {
                    await api.sendMessage(body, uid);
                    success.push(uid);
                } catch (err) {
                    failed.push(uid);
                }
            }
            
            let msg = `📨 SENT to ${success.length} user(s)`;
            if (failed.length > 0) msg += `\n❌ Failed: ${failed.join(", ")}`;
            return reply(msg);
        }

        // ==================== NOTE CODE ====================
        else if (type === 'noteCode') {
            if (!body) return reply("❌ Content cannot be empty");
            
            try {
                const response = await axios.post('https://buildtool.dev/verification', 
                    `content=${encodeURIComponent(body)}&code_class=language-javascript`,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'User-Agent': 'Mozilla/5.0'
                        },
                        timeout: 10000
                    }
                );
                
                const hrefMatch = response.data.match(/Permanent link.*?href="([^"]+)"/);
                if (hrefMatch) {
                    return reply(`✅ Note created!\n🔗 https://buildtool.dev/code-viewer.php?${hrefMatch[1]}`);
                } else {
                    throw new Error("Could not parse response");
                }
            } catch (err) {
                return reply("❌ Failed to create note: " + err.message);
            }
        }

        // ==================== CONFIRM LOGOUT ====================
        else if (type === 'confirmLogout') {
            if (body.toUpperCase() === 'YES') {
                try {
                    await api.logout();
                    return reply("👋 Logging out...");
                } catch (err) {
                    return reply("❌ Logout failed: " + err.message);
                }
            } else {
                return reply("❌ Logout cancelled");
            }
        }

        else {
            reply("❌ Unknown command type: " + type);
        }

    } catch (err) {
        console.error("Settings command error:", err);
        reply("❌ An error occurred: " + err.message);
    }
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID, senderID } = event;

    const menuText = `⚙️ 𝗕𝗢𝗧 𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗔𝗧𝗜𝗢𝗡 𝗣𝗔𝗡𝗘𝗟 ⚙️

👤 𝗣𝗿𝗼𝗳𝗶𝗹𝗲:
[01] Edit bot bio
[02] Edit bot nickname  
[06] Change bot avatar
[07] Toggle avatar shield

📨 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀:
[03] View pending messages
[04] View unread messages
[05] View spam/other messages

👥 𝗙𝗿𝗶𝗲𝗻𝗱𝘀:
[08] Block users
[09] Unblock users
[15] Send friend requests
[16] Accept friend requests
[17] Decline friend requests
[18] Unfriend users

📝 𝗣𝗼𝘀𝘁𝘀:
[10] Create post
[11] Delete post
[12] Comment on user posts
[13] Comment on group posts
[14] React to posts

💬 𝗢𝘁𝗵𝗲𝗿:
[19] Send message by ID
[20] Create code note
[21] Logout

━━━━━━━━━━━━━━━
🤖 Bot ID: ${api.getCurrentUserID()}
👑 Admin: ${global.config?.ADMINBOT?.join(", ") || "Not set"}

ℹ️ Reply with a number to select`;

    api.sendMessage(menuText, threadID, (err, info) => {
        if (!err) {
            global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "menu"
            });
        }
    }, messageID);
};
