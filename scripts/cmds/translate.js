const axios = require('axios');
const defaultEmojiTranslate = "🌐";

module.exports = {
    config: {
		name: "translate",
		aliases: ["translate"],
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "Translate text"
		},
		longDescription: {
			en: "Translate text to the desired language"
		},
		category: "utility",
		guide: {
			en: "   {pn} <text>: Translate text to the language of your chat box or the default language of the bot"
				+ "\n   {pn} <text> -> <ISO 639-1>: Translate text to the desired language"
				+ "\n   or you can reply a message to translate the content of that message"
				+ "\n   Example:"
				+ "\n    {pn} hello -> vi"
		}
	},

	langs: {
		
		en: {
			translateTo: "🌐 Translate from %1 to %2",
			invalidArgument: "❌ Invalid argument, please choose on or off",
		}
	},
  onStart: async function(){},
    onChat: async function ({ message, event, args, threadsData, getLang, commandName }) {
        const input = event.body;
        if (input && input.trim().toLowerCase().startsWith('translate') || input && input.trim().toLowerCase().startsWith('trans')) {
            const datas = input.split(" ");
            datas.shift();
            const data = datas.join(" ");
            
            const { body = "" } = event;
            let content;
            let langCodeTrans;
            const langOfThread = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;

            if (event.messageReply) {
                content = event.messageReply.body;
                let lastIndexSeparator = body.lastIndexOf("->");
                if (lastIndexSeparator == -1)
                    lastIndexSeparator = body.lastIndexOf("-");

                if (lastIndexSeparator != -1 && (body.length - lastIndexSeparator == 4 || body.length - lastIndexSeparator == 5))
                    langCodeTrans = body.slice(lastIndexSeparator + 2);
                else if ((data || "").match(/\w{2,3}/))
                    langCodeTrans = data.match(/\w{2,3}/)[0];
                else
                    langCodeTrans = langOfThread;
            }
            else {
                content = data;
                let lastIndexSeparator = content.lastIndexOf("->");
                if (lastIndexSeparator == -1)
                    lastIndexSeparator = content.lastIndexOf("-");

                if (lastIndexSeparator != -1 && (content.length - lastIndexSeparator == 4 || content.length - lastIndexSeparator == 5)) {
                    langCodeTrans = content.slice(lastIndexSeparator + 2);
                    content = content.slice(content.indexOf(data), lastIndexSeparator);
                }
                else
                    langCodeTrans = langOfThread;
            }

            if (!content)
                return message.SyntaxError();
            
            // Translate the content and send the message
            translateAndSendMessage(content, langCodeTrans, message, getLang);
        }
    },
};

async function translate(text, langCode) {
    const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodeURIComponent(text)}`);
    return {
        text: res.data[0].map(item => item[0]).join(''),
        lang: res.data[2]
    };
}

async function translateAndSendMessage(content, langCodeTrans, message, getLang) {
    const { text, lang } = await translate(content.trim(), langCodeTrans.trim());
    return message.reply(`${text}\n\n${getLang("translateTo", lang, langCodeTrans)}`);
}