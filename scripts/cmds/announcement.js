const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "announcement",
    version: "1.0",
    author: "NTKhang",
    role: 0,
    category: "box chat",
    guide: {
      vi: "   {pn} [add | -a] <announcement to add>: add announcement for group."
        + "\n   {pn}: view group announcements."
        + "\n   {pn} [edit | -e] <n> <content after edit>: edit announcement number n."
        + "\n   {pn} [delete | -d] <n>: delete announcement number n."
        + "\n"
        + "\n   Example:"
        + "\n    {pn} add New event: Party tonight!"
        + "\n    {pn} -e 1 New event: Party at 8 PM!"
        + "\n    {pn} -d 1",
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
    vi: {
      yourAnnouncements: "Các thông báo của nhóm bạn:\n%1",
      noAnnouncements: "Hiện tại nhóm bạn chưa có bất kỳ thông báo nào, để thêm thông báo cho nhóm hãy sử dụng `%1announcement add`",
      noPermissionAdd: "Chỉ quản trị viên mới có thể thêm thông báo cho nhóm",
      noContent: "Vui lòng nhập nội dung cho thông báo bạn muốn thêm",
      successAdd: "Đã thêm thông báo mới cho nhóm thành công",
      noPermissionEdit: "Chỉ quản trị viên mới có thể chỉnh sửa thông báo nhóm",
      invalidNumberEdit: "Vui lòng nhập số thứ tự của thông báo bạn muốn chỉnh sửa",
      announcementNotExist: "Không tồn tại thông báo thứ %1",
      numberAnnouncements: "Hiện tại nhóm bạn chỉ có %1 thông báo được đặt ra",
      noContentEdit: "Vui lòng nhập nội dung bạn muốn thay đổi cho thông báo thứ %1",
      successEdit: "Đã chỉnh sửa thông báo thứ %1 thành: %2",
      noPermissionDelete: "Chỉ quản trị viên mới có thể xóa thông báo của nhóm",
      invalidNumberDelete: "Vui lòng nhập số thứ tự của thông báo bạn muốn xóa",
      announcementNotExistDelete: "Không tồn tại thông báo thứ %1",
      successDelete: "Đã xóa thông báo thứ %1 của nhóm, nội dung: %2"
    },
    en: {
      yourAnnouncements: "「 ⚠️𝗚𝗥𝗢𝗨𝗣 𝗔𝗡𝗡𝗢𝗨𝗡𝗖𝗘𝗠𝗘𝗡𝗧」\n\n%1",
      noAnnouncements: "Your group has no announcements, to add announcements for the group use `%1announcement add`",
      noPermissionAdd: "Only admins can add announcements for the group",
      noContent: "Please enter the content for the announcement you want to add",
      successAdd: "Added new announcement for the group successfully",
      noPermissionEdit: "Only admins can edit group announcements",
      invalidNumberEdit: "Please enter the number of the announcement you want to edit",
      announcementNotExist: "Announcement number %1 does not exist",
      numberAnnouncements: "Your group only has %1 announcements",
      noContentEdit: "Please enter the content you want to change for announcement number %1",
      successEdit: "Edited announcement number %1 to: %2",
      noPermissionDelete: "Only admins can delete group announcements",
      invalidNumberDelete: "Please enter the number of the announcement you want to delete",
      announcementNotExistDelete: "Announcement number %1 does not exist",
      successDelete: "Deleted announcement number %1 of the group, content: %2"
    }
  },

  onStart: async function ({ role, args, message, event, threadsData, getLang, commandName }) {
    const { threadID, senderID } = event;

    const type = args[0];
    const announcementsOfThread = await threadsData.get(threadID, "data.announcements", []);
    const totalAnnouncements = announcementsOfThread.length;


          if (!type) {
        let i = 1;
        const msg = announcementsOfThread.reduce((text, announcement) => text += `╔════════════╗\n${i++}. 「❗ ${announcement.title} 」\n╚════════════╝\n ${announcement.content}\n\n`, "");
        // Update the line above to include title and content from each announcement object.
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
    if (!args[1] || !args[2])
        return message.reply(getLang("noContent"));
    const title = args[1];
    const content = args.slice(2).join(" ");
    announcementsOfThread.push({ title, content });
    try {
        await threadsData.set(threadID, announcementsOfThread, "data.announcements");
        message.reply(getLang("successAdd"));
    }
    catch (err) {
        message.err(err);
    }
  }
  //Edit
    else if (["edit", "-e"].includes(type)) {
      if (role < 1)
        return message.reply(getLang("noPermissionEdit"));
      const stt = parseInt(args[1]);
      if (isNaN(stt))
        return message.reply(getLang("invalidNumberEdit"));
      if (!announcementsOfThread[stt - 1])
        return message.reply(`${getLang("announcementNotExist", stt)}, ${totalAnnouncements == 0 ? getLang("noAnnouncements") : getLang("numberAnnouncements", totalAnnouncements)}`);
      if (!args[2])
        return message.reply(getLang("noContentEdit", stt));
      const title = args[2];
    const newContent = args.slice(3).join(" ");
    announcementsOfThread[stt - 1] = { title, content: newContent };
  
      announcementsOfThread[stt - 1] = newContent;
      try {
        await threadsData.set(threadID, announcementsOfThread, "data.announcements");
        message.reply(getLang("successEdit", stt, newContent));
      }
      catch (err) {
        message.err(err);
      }
    }//Delete
    else if (["delete", "del", "-d"].includes(type)) {
      if (role < 1)
        return message.reply(getLang("noPermissionDelete"));
      if (!args[1] || isNaN(args[1]))
        return message.reply(getLang("invalidNumberDelete"));
      const announcementDel = announcementsOfThread[parseInt(args[1]) - 1];
      if (!announcementDel)
        return message.reply(`${getLang("announcementNotExistDelete", args[1])}, ${totalAnnouncements == 0 ? getLang("noAnnouncements") : getLang("numberAnnouncements", totalAnnouncements)}`);
      announcementsOfThread.splice(parseInt(args[1]) - 1, 1);
      await threadsData.set(threadID, announcementsOfThread, "data.announcements");
      message.reply(getLang("successDelete", args[1], announcementDel));
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
    message.reply(`${num}. ${announcementsOfThread[num - 1]}`, () => message.unsend(Reply.messageID));
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
