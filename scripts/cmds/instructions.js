const commandFilePath = './jsonFile/commands.json';
const fs = require ('fs-extra');
 module.exports = {
  config: {
    name: 'instructions',
    aliases: ["ins"],
    version: '2.5',
    author: 'ambot',
    role: 0,
    category: 'utility',
    },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    const input = event.body;
    const prefixes = ["help","-help","cmd","prefix","command","Assistant","-h",];
    const normalizedInput = input && input.trim().toLowerCase();

    if (normalizedInput && prefixes.some(prefix => normalizedInput.startsWith(prefix))) {
      const son = input.split(" ");
      const songs = son.shift();
      const song = son.join(" ");
    if (!song) {
      const commandData = fs.readJsonSync(commandFilePath, { throws: false }) || [];

    if (commandData.length === 0) {
      return message.reply("The list of commands is empty.");
    }

    let response = "𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀\n\n";
    commandData.forEach((command, index) => {
      response += `❏ 「 ${command}」\n\n`;
    });
         return message.reply(`${response}Just Type \"-𝚑𝚎𝚕𝚙 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎\". Example -help Ask, to show more details.`);
    }
   const tae = song.toLowerCase();

    switch (tae) {
        case 'utrl':
            return api.sendMessage("❏「 utrl 」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n— Check the remaining access requests to the API.\n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」:\n\nutrl - 「 𝚃𝚘 𝚌𝚑𝚎𝚌𝚔 𝚝𝚑𝚎 𝚛𝚎𝚖𝚊𝚒𝚗𝚐 𝙰𝙿𝙸 𝚛𝚎𝚚𝚞𝚎𝚜𝚝𝚜」\n\nutrl @username - 「 𝚃𝚘 𝚌𝚑𝚎𝚌𝚔 𝚊 𝚞𝚜𝚎𝚛'𝚜 𝚛𝚎𝚖𝚊𝚒𝚗𝚒𝚗𝚐 𝙰𝙿𝙸 𝚛𝚚𝚎𝚞𝚎𝚜𝚝𝚜, 𝚝𝚊𝚐 𝚝𝚑𝚎𝚖」\n\nutrl <profile link> - 「 𝚃𝚘 𝚌𝚑𝚎𝚌𝚔 𝚟𝚒𝚊 𝚊 𝚙𝚛𝚘𝚏𝚒𝚕𝚎 𝚕𝚒𝚗𝚔」\n\nutrl - 「 𝚃𝚘 𝚌𝚑𝚎𝚌𝚔 𝚝𝚑𝚎 𝚕𝚊𝚜𝚝 𝚜𝚎𝚗𝚍𝚎𝚛'𝚜 𝚛𝚎𝚖𝚊𝚒𝚗𝚐 𝙰𝙿𝙸 𝚛𝚎𝚚𝚞𝚎𝚜𝚝𝚜, 𝚜𝚒𝚖𝚙𝚕𝚢 𝚛𝚎𝚙𝚕𝚢」\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\nutrl", event.threadID, event.messageID);
              break;
          case 'ai':
          return api.sendMessage("❏「 AI」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—ask an AI for an Answer. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\nAI or ask [𝚙𝚛𝚘𝚖𝚙𝚝]\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\nAi your questions.", event.threadID, event.messageID);
          break;
          case 'cs':
          return api.sendMessage("❏「 𝙲𝚜」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—direct your concern or messages to the admin. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\n/cs [𝚙𝚛𝚘𝚖𝚙𝚝]\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\n/cs your concern or messages to the admin.", event.threadID, event.messageID);
          break;
          case 'rules':
          return api.sendMessage("❏「 Rules」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—Display all the rules within the '❍Community' group.\n\n𝗡𝗢𝗧𝗘: These group rules are only applicable in the main group, which is for educational purposes only. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\n<Rule> or <Rules>\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\nRules", event.threadID, event.messageID);
          break;
          case 'brainly':
          return api.sendMessage("❏「 𝙱𝚁𝙰𝙸𝙽𝙻𝚈」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—ask academic questions and get answers. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\n𝙱𝚁𝙰𝙸𝙽𝙻𝚈 [𝚙𝚛𝚘𝚖𝚙𝚝]\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\nbrainly your questions.", event.threadID, event.messageID);
          break;
          case 'unsplash':
          return api.sendMessage("❏「𝚄𝙽𝚂𝙿𝙻𝙰𝚂𝙷」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—generate stock images from unsplash. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\n𝚄𝙽𝚂𝙿𝙻𝙰𝚂𝙷 [𝚙𝚛𝚘𝚖𝚙𝚝] | [number of images to generate]\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\nunsplash cat | 10.", event.threadID, event.messageID);
          break;
          case 'pinterest':
          return api.sendMessage("❏「𝙿𝙸𝙽𝚃𝙴𝚁𝙴𝚂𝚃」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—generate stock images from pinterest. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\n𝙿𝙸𝙽𝚃𝙴𝚁𝙴𝚂𝚃 [𝚙𝚛𝚘𝚖𝚙𝚝] | [number of images to generate]\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\npinterest cat | 10.", event.threadID, event.messageID);
          break;
          case 'tiktok':
          return api.sendMessage("❏「𝚃𝙸𝙺𝚃𝙾𝙺」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—download audio and video in tiktok. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\n{ /𝚃𝙸𝙺𝚃𝙾𝙺 -a <Tiktok Link> } for audio.\n\n{ /𝚃𝙸𝙺𝚃𝙾𝙺 -v <Tiktok Link> } for video.\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\n/tiktok -a https://vt.tiktok.com/myAudio\n\n/tiktok -v https://vt.tiktok.com/myVideo", event.threadID, event.messageID);
          break;
          case 'pinterest':
          return api.sendMessage("❏「𝙿𝙸𝙽𝚃𝙴𝚁𝙴𝚂𝚃」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—generate stock images from pinterest. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\n𝙿𝙸𝙽𝚃𝙴𝚁𝙴𝚂𝚃 [𝚙𝚛𝚘𝚖𝚙𝚝] | [number of images to generate]\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\npinterest cat | 10.", event.threadID, event.messageID);
          break;
        case 'sing':
          return api.sendMessage("❏「𝚂𝚒𝚗𝚐」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—download audio from youtube to the box chat. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\n𝚂𝚒𝚗𝚐 [song/audio to download]\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\nsing cat speed up", event.threadID, event.messageID);
          break;
        case 'lyrics':
          return api.sendMessage("❏「𝙻𝚢𝚛𝚒𝚌𝚜」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—get the lyrics of your favorite songs. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\n𝙻𝚢𝚛𝚒𝚌𝚜 [your lyrics]\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\nlyrics Pagtingin", event.threadID, event.messageID);
          break;
        case 'translate':
          return api.sendMessage("❏「𝚃𝚁𝙰𝙽𝚂𝙻𝙰𝚃𝙴」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—Translate text into desired language. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\nTranslate <your text> <-> <your desired language>\nOR\nYou can reply a message to translate the content of that message\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\n\"Translate This text i want to translate. - Filipino\" \nOR\nReply \"Translate - Filipino\"", event.threadID, event.messageID);
          break;
        case 'wikipedia':
          return api.sendMessage("❏「𝚆𝙸𝙺𝙸𝙿𝙴𝙳𝙸𝙰」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—Online encyclopedia. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\nWikipedia <your question>\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\n\"Wikipedia encyclopedia?\"", event.threadID, event.messageID);
          break;
        case 'bard':
          return api.sendMessage("❏「𝙱𝙰𝚁𝙳」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—Bard AI is a large language model chatbot developed by Google AI. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\nBard <your question> \n\n「 𝙾𝚝𝚑𝚎𝚛 𝚂𝚢𝚗𝚝𝚊𝚡 」Google <your question>\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\n\"Google what is encyclopedia?\"", event.threadID, event.messageID);
          break;
        case 'video':
          return api.sendMessage("❏「Video」\n\n「 𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 」\n—Download videos from YouTube with a maximum size limit of 80MB. \n\n「 𝚂𝚢𝚗𝚝𝚊𝚡 」\nVideo <your video to search> \n\n「 𝙾𝚝𝚑𝚎𝚛 𝚂𝚢𝚗𝚝𝚊𝚡 」Vid <your video to query>\n\nNOTE: You can select the video you want to download by replying with a number between 1 and 6 from the list.\n\n「 𝙴𝚡𝚊𝚖𝚙𝚕𝚎 」\n\"Video Moonlight Serendade\"", event.threadID, event.messageID);
          break;
        default:
          return api.sendMessage("Syntax error. Please type \"-help \" to show all available commands.",event.threadID, event.messageID);
      }
    }
  },
}