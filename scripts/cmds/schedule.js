const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "schedule",
    version: "1.0",
    author: "NTKhang",
    role: 0,
    category: "box chat",
    guide: {
      en: "   {pn} [add | -a] <announcement to add>: add announcement for group."
        + "\n   {pn}: view group announcements."
        + "\n   {pn} [edit | -e] <n> <content after edit>: edit announcement number n."
        + "\n   {pn} [delete | -d] <n>: delete announcement number n."
        + "\n"
        + "\n   Example:"
        + "\n    {pn} add New event: Party tonight!"
        + "\n    {pn} -e 1 New event: Party at 8 PM!"
        + "\n    {pn} -d 1"
    }
  },

  langs: {
    en: {
      yourAnnouncements: "「 🕜𝗖𝗟𝗔𝗦𝗦 𝗦𝗖𝗛𝗘𝗗𝗨𝗟𝗘」\n\n%1",
      noAnnouncements: "Your group has no class schedule.",
      noPermissionAdd: "Only admins can add schedule for the group",
      noContent: "Please enter the content for the schedule you want to add",
      successAdd: "Added new schedule for the group successfully",
      noPermissionEdit: "Only admins can edit group schedule",
      invalidNumberEdit: "Please enter the number of the schedule you want to edit",
      announcementNotExist: "schedule number %1 does not exist",
      numberAnnouncements: "Your group only has %1 schedule",
      noContentEdit: "Please enter the content you want to change for schedule number %1",
      successEdit: "Edited schedule number %1 to: %2",
      noPermissionDelete: "Only admins can delete group schedule",
      invalidNumberDelete: "Please enter the number of the schedule you want to delete",
      announcementNotExistDelete: "Schedule number %1 does not exist",
      successDelete: "Deleted schedule number %1 of the group, content: %2",
      invalidNumberView: "Invalid schedule number, please enter a valid number",
      successRemove: "All schedules have been removed",
    }
  },

  onStart: async function ({ role, args, message, event, threadsData, getLang, commandName }) {
    const { senderID } = event;
    const threadID = '6472246432864351';
    const others = '6617523174971779';
    const type = args[0];
    const announcementsOfThread = await threadsData.get(threadID, "data.announcements", []);
    const totalAnnouncements = announcementsOfThread.length;
    if (event.threadID !== threadID && event.threadID !== others) {
  return;
  }
    if (!type) {
      let i = 1;
      const msg = announcementsOfThread.reduce((text, announcement) => text += `\n${i++}. ${announcement.content}\n`, "");
      // Update the line above to include content from each announcement object.
      message.reply(msg ? getLang("yourAnnouncements", msg) : getLang("noAnnouncements", getPrefix(threadID)), (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          author: senderID,
          announcementsOfThread,
          messageID: info.messageID
        });
      });
    }
    else if (["add", "-a"].includes(type)) {
  if (role < 1)
    return message.reply(getLang("noPermissionAdd"));
  if (!args[1])
    return message.reply(getLang("noContent"));
  const content = args.slice(1).join(" ");
  announcementsOfThread.push({ content });
  try {
    await threadsData.set(threadID, announcementsOfThread, "data.announcements");
    message.reply(getLang("successAdd"));
  }
  catch (err) {
    message.err(err);
  }
}
//Delete
    else if (["delete", "del", "-d"].includes(type)) {
      if (role < 1)
        return message.reply(getLang("noPermissionDelete"));
      if (!args[1] || isNaN(args[1]))
        return message.reply(getLang("invalidNumberDelete"));
      const announcementDel = announcementsOfThread[parseInt(args[1]) - 1];
      if (!announcementDel)
        return message.reply(`${getLang("announcementNotExistDelete", args[1])}, ${totalAnnouncements == 0 ? getLang("noAnnouncements") : getLang("numberAnnouncements", totalAnnouncements)}`);
      announcementsOfThread.splice(parseInt(args[1]) - 1, 1);
      try {
        await threadsData.set(threadID, announcementsOfThread, "data.announcements");
        message.reply(getLang("successDelete", args[1], announcementDel.content));
      }
      catch (err) {
        message.err(err);
      }
    }
    else {
      message.SyntaxError();
    }
  },

  onReply: async function ({ message, event, getLang, Reply }) {
    const { author, announcementsOfThread } = Reply;
    if (author != event.senderID)
      return;
    const num = parseInt(event.body || "");
    if (isNaN(num) || num < 1)
      return message.reply(getLang("invalidNumberView"));
    const totalAnnouncements = announcementsOfThread.length;
    if (num > totalAnnouncements)
      return message.reply(`${getLang("announcementNotExist", num)}, ${totalAnnouncements == 0 ? getLang("noAnnouncements") : getLang("numberAnnouncements", totalAnnouncements)}`);
    message.reply(`${num}. ${announcementsOfThread[num - 1].content}`, () => message.unsend(Reply.messageID));
  },

  onReaction: async ({ threadsData, message, Reaction, event, getLang }) => {
    const { author } = Reaction;
    const { threadID, userID } = event;
    if (author != userID)
      return;
    await threadsData.set(threadID, [], "data.announcements");
    message.reply(getLang("successRemove"));
  }
};
