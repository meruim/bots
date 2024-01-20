const axios = require("axios");

module.exports = {
  config: {
	name: "simi",
		aliases: ["simisimi"],
		version: "1.0",
		author: "ViLLAVER",
		countDown: 5,
		role: 0,
		category: "ai"
  },

onStart: async function ({ api, event, args }) {
	try {
		let message = args.join(" ");
		if (!message) {
			return api.sendMessage(`Please put Message`, event.threadID, event.messageID);
		}

		const response = await axios.get(`https://api.heckerman06.repl.co/api/other/simsimi?message=${message}&lang=ph`);
		const respond = response.data.message;
		api.sendMessage(respond, event.threadID, event.messageID);
	} catch (error) {
		console.error("An error occurred:", error);
		api.sendMessage("Oops! Something went wrong.", event.threadID, event.messageID);
	}
}
};