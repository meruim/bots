const axios = require('axios');

const aiStatus = {
  enabled: true,
};

module.exports= {
  config:{
  name: 'power',
  version: '1.0.5',
  hasPermssion: 0,
  credits: 'Yan Maglinte',
  description: 'An AI command!',
  usePrefix: false,
  commandCategory: 'chatbots',
  usages: 'Ai [prompt]',
  cooldowns: 5,
},

onStart: async function({ api, event, args }) {
  if (args[0] === 'off' && event.senderID === '100055592632190') {
    
    aiStatus.enabled = false;
    return api.sendMessage('AI BOT IS OFF', event.threadID, event.messageID);
    
  } else if (args[0] === 'on' && event.senderID === '100003748955481') {
    
    aiStatus.enabled = true;
    return api.sendMessage('AI CMD IS NOW ON', event.threadID, event.messageID);
  }

  if (!aiStatus.enabled) {
    return api.sendMessage('AI CMD IS CURRENTLY OFF BY ADMINS', event.threadID, event.messageID);
  }

  const prompt = args.join(' ');
  api.setMessageReaction("⏱️", event.messageID, () => {}, true);

  try {
    const response = await axios.post('https://api.yandes.repl.co/ai', { prompt });
    
    const data = response.data;
    const output = data.reply;
    api.sendMessage(output, event.threadID, event.messageID);
    api.setMessageReaction("", event.messageID, () => {}, true);
  } catch (error) {
    
    api.sendMessage('⚠️ Something went wrong: ' + error, event.threadID, event.messageID);
    api.setMessageReaction("⚠️", event.messageID, () => {}, true);
  }
}
};