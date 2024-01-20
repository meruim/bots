const fs = require('fs-extra');

module.exports = {
  config: {
    name: "list",
    version: "1.0",
    author: "ViLLAVER",
    countDown: 0,
    role: 0,
    shortDescription: "Approved, delete, and view approve threads",
    longDescription: "",
    category: "admin",
    guide: {
      en: "{p}{n} <action> <threadID>\n\n{p}{n} <list>"
    }
  },

  onStart: async function({ event, api,message, args, threadsData , role}) {
    let filepath = JSON.parse(fs.readFileSync('list.json'));
    const input = args[0];
    if(input == "view"){
    if (filepath.length === 0) {
            message.reply("The list is empty.");
        } else {
            filepath.sort((a, b) => a.localeCompare(b)); 
            let response = "Name:\n";
            filepath.forEach((item, index) => {
                response += `${index + 1}. ${item.toUpperCase()}\n`;
            });
            message.reply(response);
        
        }
        } else if (input === "clear") {
       if(role < 1)
         return message.reply("You Dont Have Permission! Only Admin Can Clear The List");
      filepath = [];
      fs.writeFileSync('list.json', JSON.stringify(filepath, null, 2));
      message.reply("All names have been deleted.");
    }else{
   if (!args || args.length < 2) {
      return message.reply("Please provide an action ('add' or 'delete') and a name.\nType 'view' to view approve lists.\nType 'clear' to clear all names on the list.");
    }
    const action = args[0].toLowerCase();
    const input = event.body;
    const data = input.split(" ");
    data.shift();
    data.shift();
    const text = data.join(" ");
    const threadIDs = text.split(",");
    try {
      if (action === "add") {
        /*if (filepath.includes(threadID)) {
          return message.reply("This name is already in the list.");
        }*/

        for (const threadID of threadIDs) {
  const cleanedThreadID = threadID.trim(); 
  if (filepath.includes(cleanedThreadID)) {
    api.sendMessage(`❗Name: ${cleanedThreadID} already exist in the list`, event.threadID, event.messageID);
  } else {
    filepath.push(cleanedThreadID);
    api.sendMessage(`✅Name: ${cleanedThreadID} has been added.`, event.threadID, event.messageID);
  }
}
      } else if (action === "delete") {
    const numberToDelete = parseInt(args[1]);

        if (isNaN(numberToDelete) || numberToDelete <= 0 || numberToDelete > filepath.length) {
            return message.reply("Invalid number. Please provide a valid number from the list.");
        }

        const threadIDToDelete = filepath[numberToDelete - 1];
        filepath.splice(numberToDelete - 1, 1);

        fs.writeFileSync('list.json', JSON.stringify(filepath, null, 2));

        message.reply(`Name '${threadIDToDelete}' has been deleted.`);
      }else {
        return message.reply("Invalid action. Please use 'add' or 'delete'.");
      }

      fs.writeFileSync('list.json', JSON.stringify(filepath, null, 2));
    } catch (error) {
      console.error(error);
      api.sendMessage(`${error}`, event.threadID, event.messageID);
    }
  }
  }
};