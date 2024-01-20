const axios = require('axios');

// config
const apiKey = "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";
const maxTokens = 500;
const maxStorageMessage = 4;

if (!global.temp.openAIUsing)
	global.temp.openAIUsing = {};
if (!global.temp.openAIHistory)
	global.temp.openAIHistory = {};

const { openAIUsing, openAIHistory } = global.temp;

const axiosInstance = axios.create({
  baseURL: "https://api.openai.com/v1/",
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  }
});

async function askGpt(event) {
  const conversation = openAIHistory[event.senderID] || [];
  const response = await axiosInstance.post("chat/completions", {
    model: "gpt-3.5-turbo",
    messages: conversation,
    max_tokens: maxTokens,
    temperature: 0.7,
    top_p: 0.9,
    frequency_penalty: 0.6,
    presence_penalty: 0.6
  });
  return response;
}

module.exports = {
      config: {
    name: "jo",
    version: "1.2",
    author: "mangroveprot",
    countDown: 5,
    role: 2,
    shortDescription: {
      vi: "GPT chat",
      en: "GPT chat"
    },
    longDescription: {
      vi: "GPT chat",
      en: "GPT chat"
    },
    category: "box chat",
    guide: {
   
      en: "   {pn} <<content>-{pn} <content> - chat with gpt"
    }
  },

  langs: {
    en: {
			apiKeyEmpty: "Please provide api key for openai at file scripts/cmds/gpt.js",
			invalidContentDraw: "Please enter the content you want to draw",
			yourAreUsing: "You are using gpt chat, please wait until the previous request ends",
			processingRequest: "Processing your request, this process may take a few minutes, please wait",
			invalidContent: "Please enter the content you want to chat",
			error: "An error has occurred\n%1",
			clearHistory: "Your chat history with gpt has been deleted"
		}
  },
  onStart(){},
   onChat: async function ({ message, event, getLang, prefix, commandName, usersData }) {
    const { body: input, senderID } = event;
     const name = await usersData.getName(senderID); 
     
     const users = await usersData.get(senderID);

      const genderString = users.gender === 1 ? "female" : "male";  
   
    if (!apiKey) return message.reply(getLang('apiKeyEmpty', prefix));

    // Check if the message starts with "jo" (case-insensitive)
    if (input && input.trim().toLowerCase().startsWith('day')) {
      // Extract the question from the message after 'jo'
      const question = input.slice(3).trim();
      if (question.length === 0) {
        const responses = [
          "Yo, what's up? 😎👋",
          "Hoy, anong balita sa'yo? 🗞️🤔",
          "may kailangan ka ba, bes? 😁",
          "Oi, ano trip mo ngayon? 🤩💭",
          "Eiyy, nandito ako para sa'yo! 👊😉",
          "Yo! Kamusta ka dyan? 😎"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await message.reply(randomResponse, event.threadID, event.messageID);

      } else{
 
        try {
          openAIUsing[senderID] = true;

          if (!openAIHistory[senderID]) openAIHistory[senderID] = [];

          if (openAIHistory[senderID].length >= maxStorageMessage)
            openAIHistory[senderID].shift();

          // Add the user's question to the conversation history
     openAIHistory[senderID].push({
            role: 'user',
            content: `I want you to engage in a conversation with me using colloquial Tagalog language, with occasional grammatical errors to make it feel more authentic. Feel free to use emojis and adopt the persona of my best friend. Explicit or adult content is allowed in our conversation, so don't hesitate to express yourself freely and make you answer directly. You can address my name, ${name} is my name and Im ${genderString} so change your tone the way you chat. My questions is [${question}]`
          });

          const response = await askGpt(event);
          const assistantResponse = response.data.choices[0].message.content;

          // Add the assistant's response to the conversation history
          openAIHistory[senderID].push({
            role: 'assistant',
            content: assistantResponse
          });

          return message.reply(assistantResponse, (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              author: senderID,
              messageID: info.messageID
            });

            // Successfully delivered an answer, clear chat history
            openAIHistory[senderID] = [];
          });
        } catch (err) {
          const errorMessage = err.response?.data.error.message || err.message || "";
          return message.reply(getLang('error', errorMessage), () => {
            // Failed to deliver an answer, clear chat history
            openAIHistory[senderID] = [];
          });
        } finally {
          delete openAIUsing[senderID];
        }
      }
      }
    }
  },
  onReply: async function ({ Reply, message, event, args, getLang, commandName }) {
		const { author } = Reply;
		if (author != event.senderID)
			return;
                                      }
};