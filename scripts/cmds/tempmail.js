const axios = require('axios');

module.exports = {
  config: {
    name: "tempmail",
    version: "1.0",
    author: "ViLLAVER",
    credits: "Angelo Cayao Arabis",
    countDown: 5,
    role: 0,
    category: "generate",
    shortDescription: {
      en: "Generate A Temporary Mail"
    },
    guide: {
			en: " {pn} <gen> <your mail name> for generating a tempmail"+"\{pn} <inbox> <your generated email> Check inbox for your generated mail."
		}
  },

  onStart: async function({ api, event, args }) {
    const [action, parameter] = args;

    if (action === "gen") {
      try {
        const response = await axios.get(`https://official-anjelo-api.anjelopogialways.repl.co/tempmailv3gen?localPart=${parameter}`);
        api.sendMessage(response.data.result, event.threadID);
      } catch (error) {
        api.sendMessage("An error occurred while generating the temporary email address.", event.threadID);
      }
    } else if (action === "inbox") {
      try {
        const response = await axios.get(`https://official-anjelo-api.anjelopogialways.repl.co/tempmailv3inbox?email=${parameter}`);
        api.sendMessage(response.data.result, event.threadID, event.messageID);
      } catch (error) {
        api.sendMessage("An error occurred while fetching inbox messages.", event.threadID);
      }
    } 
  }
};