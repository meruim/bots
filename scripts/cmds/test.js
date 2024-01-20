const commandFilePath = './jsonFile/help.json';
const fs = require('fs-extra');

module.exports = {
  config: {
    name: 'test',
    aliases: ["t"],
    version: '2.5',
    author: 'ambot',
    role: 2,
    category: 'utility',
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    const input = event.body;
    const prefixes = ["test"];
    const normalizedInput = input && input.trim().toLowerCase();
    const userRole = 2; // Assume the user's role, change as needed

    function showCommandDetails(commandData, name) {
      const matchingCommand = commandData.find(cmd => cmd.name.toLowerCase() === name.toLowerCase());
      if (matchingCommand) {
        return message.reply(`Command: ${matchingCommand.name}\nInstructions: ${matchingCommand.inst}`);
      } else {
        return message.reply(`Error: The command "${name}" does not exist in the commands list.`);
      }
    }

    if (normalizedInput && prefixes.some(prefix => normalizedInput.startsWith(prefix))) {
      const son = input.split(" ");
      const command = son[0].toLowerCase(); // command is now the first argument
      const name = son[1]; // second argument as name
      const inst = son.slice(2).join(" "); // third argument as inst
      try{
      if (!command) {
        const commandData = fs.readJsonSync(commandFilePath, { throws: false }) || [];

        if (commandData.length === 0) {
          return message.reply("The list of commands is empty.");
        }

        const response = "𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗮𝗻𝗱𝘀\n\n" + 
          commandData.map(cmd => `❏ ${cmd.name}\n\n`).join('');

        return message.reply(`${response}Just Type "-𝚑𝚎𝚕𝚙 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎". Example -help Ask, to show more details.`);
      } else if (command === "add" && name && inst && userRole >= 2) {
        const commandData = fs.readJsonSync(commandFilePath, { throws: false }) || [];
        if (commandData.some(cmd => cmd.name.toLowerCase() === name.toLowerCase())) {
          return message.reply(`Error: The command "${name}" already exists in the commands list.`);
        }

        const newCommand = { name, inst };
        commandData.push(newCommand);

        const sortedCommands = commandData.sort((a, b) => a.name.localeCompare(b.name));

        fs.writeJsonSync(commandFilePath, sortedCommands, { spaces: 2 });

        return message.reply(`The command "${name}" has been added to the commands list in sorted order.`);
      } else if (command === "delete" && name && userRole >= 2) {
        // Handle deleting data from the JSON file
        const commandData = fs.readJsonSync(commandFilePath, { throws: false }) || [];
        const matchingCommandIndex = commandData.findIndex(cmd => cmd.name.toLowerCase() === name.toLowerCase());

        if (matchingCommandIndex !== -1) {
          commandData.splice(matchingCommandIndex, 1);
          fs.writeJsonSync(commandFilePath, commandData, { spaces: 2 });
          return message.reply(`The command "${name}" has been deleted from the commands list.`);
        } else {
          return message.reply(`Error: The command "${name}" does not exist in the commands list.`);
        }
      } else {
        const commandData = fs.readJsonSync(commandFilePath, { throws: false }) || [];
        return showCommandDetails(commandData, name);
      }
      } catch (error){
        message.reply(error.message);
      }
    }
  }
};