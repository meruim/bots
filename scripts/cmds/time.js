const moment = require('moment-timezone');

module.exports = {
 config: {
 name: "test",
 version: "1.0",
 author: "OtinXSandip",
 countDown: 30,
 role: 0,
 shortDescription: "See Bangladesh's Current Time",
 longDescription: "See Bangladesh's Current Time",
 category: "General",
 guide: "{pn}"
 },

 onStart: async function ({ api, event, args }) {
 const currentDate = moment().tz('Asia/tenggara').format('2023-8-9);
 const currentDay = moment().tz('Asia/tenggara').format('dddd');
 const currentTime = moment().tz('Asia/tenggara').format('h:mm:ss A');
 api.sendMessage(`Today's Date: ${currentDate}\: ${currentDay}\e: ${currentTime}`, event.threadID);
 }
};