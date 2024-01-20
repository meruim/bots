const fs = require("fs-extra");

module.exports = {
  config: {
    name: "rules",
    version: "1.0",
    author: "ViLLAVER",
    countDown: 0,
    role: 0,
    shortDescription: "Manage group rules",
    longDescription: "",
    category: "admin",
    guide: {
      en: "{p}{n} <action> <ruleText>\n\n{p}{n} <list>",
    },
  },
  onStart: async function () {},
  onChat: async function ({
    event,
    api,
    message,
    args,
    threadsData,
    role,
    usersData,
  }) {
    const isGroup = event.threadID;
    const tid = ["6691783234215885","24513799564870506", "6561347957281741", "6611368425597839"];
    const input = event.body;
    const userID = event.senderID;
    const data = await usersData.get(userID);
    const status = data.banned.status;
    const reason = data.banned.reason;
    const name = data.name;
    const { msg } = "You Don't Have Permission! Only Admin Can Clear The Rules";

    if (
      (input && input.trim().toLowerCase().startsWith("rules")) ||
      (input && input.trim().toLowerCase().startsWith("rule"))
    ) {
      if (!tid.includes(isGroup)) return;
      if (status == true) {
        return message.reply(
          `⚠ | You have been banned from using the bot\n❍Reason: ${reason}\n❏Please contact the admin in this group to request for compliment.`
        );
      }

      const inputArray = input.split(" "); // Split the input message into an array
      inputArray.shift(); // Remove the first element ("rules" or "rule")

      let ruleText = inputArray.slice(1).join(" "); // Start from index 1 to exclude the action word


      const ruleList = JSON.parse(fs.readFileSync("./jsonFile/rules.json"));
      const action = inputArray[0];

      if (!action) {
        if (ruleList.length === 0) {
          message.reply("There are no rules in the list.");
        } else {
          let response = "❏ 𝙂𝙧𝙤𝙪𝙥 𝙍𝙪𝙡𝙚𝙨\n\n";
          ruleList.forEach((rule, index) => {
            response += `${index + 1}. ${rule}\n\n`;
          });
          message.reply(`${response}\nViolation penalties will be assessed based on your behavior, so please adhere to these rules to avoid any consequences.`);
        }
      } else if (action === "clear") {
        if (role < 1) return message.reply(msg);
        ruleList.length = 0;
        fs.writeFileSync("./jsonFile/rules.json", JSON.stringify(ruleList, null, 2));
        message.reply("All rules have been cleared.");
      } else if (action === "add") {
        if (role < 1) return message.reply(msg);
        if (ruleText.length < 2) {
          return message.reply("Please provide a rule text to add.");
        }
        ruleList.push(ruleText);
        fs.writeFileSync(
          "./jsonFile/rules.json",
          JSON.stringify(ruleList, null, 2)
        );
        message.reply("The rule has been added.");
            } else if (action === "delete") {
        if (role < 1) return message.reply(msg);
      
        // Check if there's a rule number immediately after "delete"
        if (inputArray.length < 2) {
          return message.reply("Please provide the rule number to delete.");
        }
      
        // Extract the rule number from the inputArray
        const ruleNumberToDelete = parseInt(inputArray[1]);
      
        // Make sure to use a proper index to access the rule number
        if (
          isNaN(ruleNumberToDelete) ||
          ruleNumberToDelete <= 0 ||
          ruleNumberToDelete > ruleList.length
        ) {
          return message.reply(
            "Invalid rule number. Please provide a valid number from the list."
          );
        }
        const deletedRule = ruleList.splice(ruleNumberToDelete - 1, 1);
        fs.writeFileSync("./jsonFile/rules.json", JSON.stringify(ruleList, null, 2));
        message.reply(`Rule '${deletedRule}' has been deleted.`);
      }else {
        message.reply("To View Group Rules Simply Just Type \"Rules\" or \"Rule\"!");
      }
    }
  },
};