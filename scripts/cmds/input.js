const commandFilePath = './jsonFile/commands.json';
const fs = require('fs-extra');

module.exports = {
  config: {
    name: 'input',
    aliases: ["ins"],
    version: '2.5',
    author: 'ambot',
    role: 2,
    category: 'utility',
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    const input = event.body;
    const prefixes = ["/input", "/add", "/command"];
    const normalizedInput = input && input.trim().toLowerCase();

    if (normalizedInput && prefixes.some(prefix => normalizedInput.startsWith(prefix))) {
      const son = input.split(" ");
      const command = son[1]; // command is the second argument
      const data = son.slice(2).join(" "); // data is the content provided after the command

      if (!command) {
        const commandData = fs.readJsonSync(commandFilePath, { throws: false }) || [];

        if (commandData.length === 0) {
          return message.reply("The list of commands is empty.");
        }

        const response = "𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗮𝗻𝗱𝘀\n\n" + 
          commandData.map(cmd => `❏ 「 ${cmd}」\n\n`).join('');

        return message.reply(`${response}Just Type "-𝚑𝚎𝚕𝚙 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎". Example -help Ask, to show more details.`);
      } else if (command.toLowerCase() === "add" && data) {
        // Handle adding data to the JSON file in a sorted way
        const commandData = fs.readJsonSync(commandFilePath, { throws: false }) || [];

        // Check if the data already exists (case-sensitive)
        if (commandData.includes(data)) {
          return message.reply(`Error: The data "${data}" already exists in the commands list.`);
        }

        commandData.push(data); // Add the content of data to the array

        const sortedCommands = commandData.sort((a, b) => a.localeCompare(b));

        fs.writeJsonSync(commandFilePath, sortedCommands, { spaces: 2 });

        return message.reply(`The data "${data}" has been added to the commands list in sorted order.`);
      } else if (command.toLowerCase() === "delete" && data) {
        // Handle deleting data from the JSON file
        const commandData = fs.readJsonSync(commandFilePath, { throws: false }) || [];

        if (commandData.includes(data)) {
          const updatedCommands = commandData.filter(cmd => cmd !== data);
          fs.writeJsonSync(commandFilePath, updatedCommands, { spaces: 2 });

          return message.reply(`The data "${data}" has been deleted from the commands list.`);
        } else {
          return message.reply(`Error: The data "${data}" does not exist in the commands list.`);
        }
      } else {
        // Handle other cases or unrecognized commands
        return message.reply(`Unrecognized command or invalid input.`);
      }
    }
  }
};