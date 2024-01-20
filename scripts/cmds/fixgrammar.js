const axios = require('axios');
module.exports = {
	config: {
		name: "fix",
		aliases: ["fixgrammar"],
		version: "1.0",
		author: "MILAN",
		countDown: 5,
		role: 0,
		shortDescription: "is a command that helps improve grammar by suggesting corrections and providing recommendations.",
		longDescription: "is a command that helps improve grammar by suggesting corrections and providing recommendations.",
		category: "ai",
		guide: {
			en: "{pn} [Sentences/Paragraph]"
		},
	},

	onStart: async function ({ message, args, api, event }) {
		const axios = require("axios");
		let { threadID, messageID } = event;
		const text = args.join(" ");
		if (!text) return api.sendMessage(`❌Baka use correctly`, threadID, messageID);

		try {
			const res = await axios.get(`https://grammarcorrection.mahirochan1.repl.co/grammar?text=${text}`);
			const { message } = res.data;
			api.sendMessage(`📜Corrected Paragraph: ${message}`, threadID, messageID);
		} catch (error) {
			console.error(error);
			api.sendMessage("An error occurred while making the API request.", threadID, messageID);
		}
	},
  	onChat: async function ({ event, message}) {
		if (event.body && event.body.toLowerCase() === "fixmygrammar"){
      await message.reply("❏「 𝙵𝚒𝚡𝙼𝚢𝙶𝚛𝚊𝚖𝚖𝚊𝚛 」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\nimprove grammar by suggesting corrections and providing recommendations\n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\n/fix [prompt]\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\n/fix my grammatical error");
   }
},
};