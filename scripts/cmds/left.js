const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
module.exports = {
	config: {
		name: "out",
		aliases: ["left"],
		version: "1.0",
		author: "Sandy",
		countDown: 5,
		role: 1,
		shortDescription: "bot will leave gc",
		longDescription: "",
		category: "admin",
		guide: {
			vi: "{pn} [tid,blank]",
			en: "{pn} [tid,blank]"
		}
	},

	onStart: async function ({ api,event,args, message }) {
 let id;
 id = event.threadID;
 return api.sendMessage('🚀', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
		}
	};