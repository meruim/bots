const axios = require('axios');
module.exports = {
  config: {
    name: 'gpt',
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
  onStart: async function ({ api, event, args, message }){
    
     const prompt = args.join(" ");
      if (!prompt) {
          message.reply("Add your prompt!");
        return;
      }
      try {
        api.setMessageReaction("🤖", event.messageID, event.threadID, api); 
    const response = await axios.get(`https://api--mangroveprotvillaver.repl.co/bard?prompt=Utopia: Origin is a sandbox survival game developed and published by HK HERO ENTERTAINMENT. It was released on November 21, 2018 for iOS and Android.The game is set in the world of Beia, a vast and mysterious land. Players must survive by gathering resources, crafting items, and building structures. They can also explore the world, fight monsters, and tame pets.Utopia: Origin is a multiplayer game, and players can form clans to work together. The game also features a variety of events and challenges that players can participate in.Here are some of the features of Utopia: Origin:Open world survival: Explore a vast and mysterious world, gather resources, craft items, and build structures to survive.Multiplayer: Play with friends or join clans to work together.PvE and PvP: Fight monsters, explore dungeons, and battle other players.Taming system: Tame pets to help you in your adventures.Events and challenges: Participate in a variety of events and challenges to earn rewards.If you are looking for a challenging and rewarding survival game, then Utopia: Origin is a great choice. The game is free to play, but there are in-app purchases available.Here are some additional details about the game:The game world is divided into different biomes, each with its own unique resources and challenges.Players can craft a variety of items, including weapons, armor, tools, and furniture.There are a variety of monsters to fight, including bosses that can drop rare items.Players can build their own homes and villages, or join clans to work together.The game features a variety of events and challenges, such as PvP battles, dungeon raids, and treasure hunts.Utopia: Origin is a sandbox survival game developed and published by HK HERO ENTERTAINMENT. It was released on November 21, 2018 for iOS and Android.The game is set in the world of Beia, a vast and mysterious land. Players must survive by gathering resources, crafting items, and building structures. They can also explore the world, fight monsters, and tame pets.Utopia: Origin is a multiplayer game, and players can form clans to work together. The game also features a variety of events and challenges that players can participate in.Here are some of the features of Utopia: Origin:Open world survival: Explore a vast and mysterious world, gather resources, craft items, and build structures to survive.Multiplayer: Play with friends or join clans to work together.PvE and PvP: Fight monsters, explore dungeons, and battle other players.Taming system: Tame pets to help you in your adventures.Events and challenges: Participate in a variety of events and challenges to earn rewards.If you are looking for a challenging and rewarding survival game, then Utopia: Origin is a great choice. The game is free to play, but there are in-app purchases available.Here are some additional details about the game:The game world is divided into different biomes, each with its own unique resources and challenges.Players can craft a variety of items, including weapons, armor, tools, and furniture.There are a variety of monsters to fight, including bosses that can drop rare items.Players can build their own homes and villages, or join clans to work together.The game features a variety of events and challenges, such as PvP battles, dungeon raids, and treasure hunts.Utopia: Origin is a fun and challenging game that offers a lot of freedom to players. If you are looking for a new survival game to play. So my question is: ${prompt}`
      );
    if (response.status !== 200 || !response.data) {
        throw new Error('Invalid or missing response from API');
      }
    await message.reply(response.data.result);
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.messageID, event.threadID);
      }
  },
};