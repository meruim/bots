const fs = require('fs-extra');
const { getTime } = global.utils;
module.exports = {
  config: {
    name: "approve",
    version: "1.0",
    credits: "JISHAN76",
    author: "ViLLAVER",
    countDown: 0,
    role: 2,
    shortDescription: "Approved, delete, and view approve threads",
    longDescription: "",
    category: "admin",
    guide: {
      en: "{p}{n} <action> <threadID>\n\n{p}{n} <list>"
    }
  },

  onStart: async function({ event, api,message, args, threadsData }) {
    let filepath = JSON.parse(fs.readFileSync('tid.json'));
    const input = args[0];
    if(input == "list"){
      try{
        const results = [];
        for (const threadID of filepath) {
    const threadData = await threadsData.get(threadID);
    //
    const createdDate = getTime(threadData.createdAt, "DD/MM/YYYY HH:mm:ss");
		const valuesMember = Object.values(threadData.members).filter(item => item.inGroup);
const numberOfMembers = valuesMember.length;
		const totalMessage = valuesMember.reduce((i, item) => i += item.count, 0);
		const infoBanned = threadData.banned.status ?
					`\n- Banned: ${threadData.banned.status}`
					+ `\n- Reason: ${threadData.banned.reason}`
					+ `\n- Time: ${threadData.banned.date}` :
					"Approve";
					
    results.push(`📄Name: ${threadData.threadName}\nID: ${threadData.threadID}\n📅Date Created: ${createdDate}\n👥Members: ${numberOfMembers}\n✉️Total Message: ${totalMessage}\n⭕Status: ${infoBanned}`);
  }

  const msg = results.join('\n\n ');
  message.reply(msg);
      }catch(error){
        api.sendMessage(`${error}`, event.threadID);
      }
    }else{
   if (!args || args.length < 2) {
      return message.reply("Please provide an action ('approve' or 'delete') and a threadID.\n\n 'list' to view approve lists.");
    }
    const action = args[0].toLowerCase();
    const threadID = args[1];

    try {
      if (action === "approve") {
        // Check if the threadID already exists
        if (filepath.includes(threadID)) {
          return message.reply("This threadID is already approved.");
        }

        filepath.push(threadID);

        message.reply(`ThreadID '${threadID}' has been approved.`);
      } else if (action === "delete") {
        // Check if the threadID exists
        const index = filepath.indexOf(threadID);
        if (index === -1) {
          return message.reply("This threadID is not approved.");
        }

        filepath.splice(index, 1);

        message.reply(`ThreadID '${threadID}' has been deleted.`);
        
      }else {
        return message.reply("Invalid action. Please use 'approve' or 'delete'.");
      }

      fs.writeFileSync('tid.json', JSON.stringify(filepath, null, 2));
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while processing the action. Please try again later.");
    }
  }
  }
};