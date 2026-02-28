const { spawn } = require("child_process");
const axios = require("axios").default;
const logger = require("./utils/log");
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

let restartCount = 0;
const MAX_RESTARTS = 5;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  logger(`Server is running on port ${port}...`, "[ STARTING ]");
}).on("error", err => {
  logger(
    err.code === "EACCES"
      ? `Permission denied. Cannot bind to port ${port}.`
      : `Server error: ${err.message}`,
    "[ Error ]"
  );
});

function startBot(msg) {
  if (msg) logger(msg, "[ STARTING ]");

  const bot = spawn(
    "node",
    ["--trace-warnings", "--async-stack-traces", "Sahu.js"],
    {
      cwd: __dirname,
      stdio: "inherit",
      shell: true
    }
  );

  bot.on("close", code => {
    logger(`Bot crashed with code ${code}.`, "[ CRASH ]");

    if (restartCount < MAX_RESTARTS) {
      restartCount++;
      logger(`Restarting... (${restartCount}/${MAX_RESTARTS})`, "[ RESTART ]");
      startBot();
    } else {
      logger(`Maximum restart limit reached (${MAX_RESTARTS}). Bot will NOT restart.`, "[ STOPPED ]");
    }
  });

  bot.on("error", err => {
    logger(`Process error: ${err}`, "[ Error ]");

    if (restartCount < MAX_RESTARTS) {
      restartCount++;
      logger(`Restarting... (${restartCount}/${MAX_RESTARTS})`, "[ RESTART ]");
      startBot();
    } else {
      logger(`Maximum restart limit reached (${MAX_RESTARTS}). Bot will NOT restart.`, "[ STOPPED ]");
    }
  });
}

// Update Info Fetch
(async () => {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/shahadat-sahu/fbbot/main/package.json",
      { timeout: 5000 }
    );
    logger(res.data.name, "[ NAME ]");
    logger(`Version: ${res.data.version}`, "[ VERSION ]");
    logger(res.data.description, "[ DESCRIPTION ]");
  } catch (err) {
    logger(`Update check failed: ${err.message}`, "[ Update Error ]");
  }
})();

startBot();