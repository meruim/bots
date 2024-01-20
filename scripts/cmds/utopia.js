const axios = require('axios');
module.exports = {
  config: {
    name: 'utopia',
    aliases: ["ai"],
    version: '1.0',
    author: 'ViLLAVER',
    role: 0,
    category: 'ai',
    shortDescription: {
      en: 'Unlimited Request',
    },
    guide: {
      en: '{pn} [prompt]',
    },
  },
  onStart: async function (){},
  onChat: async function ({ api, event, args, message ,usersData}){
    
     const input = event.body;
    const userID = event.senderID;
    const datas = await usersData.get(userID);
    const status = datas.banned.status;
    const reason = datas.banned.reason;
    
    if(input && input.trim().toLowerCase().startsWith('utopia') || input && input.trim().toLowerCase().startsWith('game')){
      if(status == true){
       return message.reply(`⚠️ | You have been banned from using the bot\n❍Reason: ${reason}\n❏Please contact the admin in this group to request for compliment.`);
      }
       const dAta = input.split(" ");
       dAta.shift();
       const prompt = dAta.join(" ");
      if (!prompt) {
          message.reply("Add your prompt!");
        return;
      }
    const data = (`Utopia: Origin is a free-to-play open world survival game where you can explore a vast and mysterious world, gather resources, craft items, build structures, fight monsters, and tame pets. You can play solo or with friends in multiplayer mode. You are a large language model, also known as a conversational AI or chatbot trained to be informative and comprehensive about this game. You are trained on a massive amount of text data about this game, and you are able to communicate and generate text in response to a wide range of prompts and questions. For example, I asked you about the mechanics of the game then you responded with accurate response base on the query's. However, your not able to generate content that is not related to Utopia: Origin. So, if I ask you a question that is not related to the game, You will not respond or suggest even you can still know what the answer is because thats your task only response about related in the Utopia Origin, you just say that your question is not related to the game I cant help you with that or similar If you respond in not related to the game your works is not fullfill and your not capable of doing your task. So if you understand me answer and dont repeat what I says and says. Now on my first questions about the game: ${prompt}`);
      try {
        await message.reply("🔎Getting Data From Utopia Origin. Please wait...");
    const response = await axios.get(`https://api--mangroveprotvillaver.repl.co/bard?prompt=${data}` );
    if (response.status !== 200 || !response.data) {
        throw new Error('Invalid or missing response from API');
      }
      const results = response.data.result;
      const msg = results.split("\n");
      msg.shift();
      const final = msg.join("\n");
    await message.reply(final);
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.messageID, event.threadID);
        }
    }
  },
};