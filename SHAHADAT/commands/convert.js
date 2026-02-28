module.exports.config = {
    name: "convert",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU", //please don't change credit
    description: "Send media with source converte video",
    commandCategory: "media",
    usages: "convert <link1> <link2> ...",
    cooldowns: 5,
    usePrefix: true,
    dependencies: {
        axios: "",
        "fs-extra": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const path = require("path");

    if (!args.length) {
        return api.sendMessage(
            "Use: convert <link1> <link2> ...",
            event.threadID,
            event.messageID
        );
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    const USER_AGENT =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    let hasError = false;

    for (const url of args) {
        const ext = path.extname(url).split("?")[0] || ".mp4";
        const filePath = path.join(
            cacheDir,
            `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`
        );

        try {
            const res = await axios.get(url, {
                responseType: "arraybuffer",
                timeout: 30000,
                headers: {
                    "User-Agent": USER_AGENT,
                    "Referer": "https://imgur.com/"
                }
            });

            fs.writeFileSync(filePath, res.data);

            const text =
`📥 Converted from:
${url}`;

            await new Promise((resolve) =>
                api.sendMessage(
                    {
                        body: text,
                        attachment: fs.createReadStream(filePath)
                    },
                    event.threadID,
                    () => {
                        fs.unlinkSync(filePath);
                        resolve();
                    },
                    event.messageID
                )
            );
        } catch (e) {
            hasError = true;
            await api.sendMessage(
                `❌ Failed to load:\n${url}`,
                event.threadID,
                event.messageID
            );
        }
    }

    api.setMessageReaction(hasError ? "❌" : "✅", event.messageID, () => {}, true);
};