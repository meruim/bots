const axios = require('axios');

const Prefixes = [
  'ai'
];

module.exports = {
  config: {
    name: 'ask',
    aliases: ["ai"],
    version: '2.5',
    author: 'VɪLLAVER',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Asks an AI for an answer.',
    },
    longDescription: {
      en: 'Asks an AI for an answer based on the user prompt.',
    },
    guide: {
      en: '{pn} [prompt]',
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      const credits = this.config.author;
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      
      // Check if the prefix is valid
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }

      // Remove the prefix from the message body
      const prompt = event.body.substring(prefix.length).trim();

      // Check if prompt is empty
      if (prompt === '') {
        await message.reply(
          "Kindly provide the question at your convenience and I shall strive to deliver an effective response. Your satisfaction is my top priority."
        );
        return;
      }

      // Send a message indicating that the question is being answered
      await message.reply("Answering your question. Please wait a moment...");
      const stopTyping = api.sendTypingIndicator(event.threadID);
       const responseMessage = await getMessage(prompt);
       
      stopTyping(() => {
          // Mengirim pesan setelah selesai mengetik
           message.reply(responseMessage);
        });
      

      console.log('Sent answer as a reply to user');
    } catch (error) {
      console.error(`Failed to get answer: ${error.message}`);
      api.sendMessage(
        `${error.message}.\n\nYou can try typing your question again or resending it, as there might be a bug from the server that's causing the problem. It might resolve the issue.`,
        event.threadID
      );
    }
  },
};
async function getMessage(yourMessage, langCode) {
  const credits = this.config.author;
  const response = await axios.get(`https://api--mangroveprotvillaver.repl.co/api/?author=${credits}&prompt=${
        prompt
      }`);
  if (response.status > 200) {
    throw new Error(res.data.success);
  }

  return response.data.result;
}