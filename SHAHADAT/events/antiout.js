module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "SHAHADAT SAHU",
  description: "Auto add member back when leaving the group"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  let data = (await Threads.getData(event.threadID)).data || {};
  if (data.antiout == false) return;
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const userID = event.logMessageData.leftParticipantFbId;
  const userName =
    global.data.userName.get(userID) || (await Users.getNameUser(userID));

  const type =
    event.author == userID
      ? "self-separation"
      : "being kicked by admin";

  if (type == "self-separation") {
    api.addUserToGroup(userID, event.threadID, (error) => {
      if (error) {
        return api.sendMessage(
          `╭•┄┅═══❁🌺❁═══┅┄•╮
❌ 𝐀𝐝𝐝 𝐅𝐚𝐢𝐥𝐞𝐝  
╰•┄┅═══❁🌺❁═══┅┄•╯

😞 ${userName} গ্রুপ ছেড়ে গেছে  
কিন্তু তাকে আবার যোগ করা যাচ্ছে না…

📌 কারণ:
• মেসেঞ্জার ব্লক করেছে  
• প্রোফাইল রেস্ট্রিকশন  
• আইডির প্রাইভেসি 

✦•━༻🌺 ${global.config.BOTNAME} 🌺༺━•✦`,
          event.threadID
        );
      }

      return api.sendMessage(
        `╭•┄┅═══❁🌺❁═══┅┄•╮
✅ 𝐀𝐝𝐝𝐞𝐝 𝐀𝐠𝐚𝐢𝐧  
╰•┄┅═══❁🌺❁═══┅┄•╯

💫 *${userName}*  
গ্রুপ থেকে বের হয়েছিল…  
আবার সফলভাবে গ্রুপে ফিরিয়ে আনা হলো! 💙✨

✦•─•❁🌸 ${global.config.BOTNAME} 🌸❁•─•✦`,
        event.threadID
      );
    });
  }
};