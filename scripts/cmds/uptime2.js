const axios = require("axios");
const { performance } = require("perf_hooks");

//si hatdog nah deob

const monitoringData = {};

function startMonitoring(api, url, threadID, messageID) {
  const startTime = performance.now();
  let lastCheckTime = startTime;

  const checkStatus = async () => {
    try {
      const response = await axios.get(url);

      if (response.status === 200) {
        const currentTime = performance.now();
        const uptime = (currentTime - startTime) / 1000;

        api.sendMessage(`🆕 The URL ${url} is up and running. Uptime: ${uptime.toFixed(2)} seconds.`, threadID, messageID);

        lastCheckTime = currentTime;
        console.log(`[${new Date().toISOString()}] URL ${url} is up.`);
      }
    } catch (error) {
      const currentTime = performance.now();
      const downtime = (currentTime - lastCheckTime) / 1000;

      api.sendMessage(`⏬ The URL ${url} is currently down. Downtime: ${downtime.toFixed(2)} seconds.`, threadID, messageID);

      lastCheckTime = currentTime;
      console.log(`[${new Date().toISOString()}] URL ${url} is down.`);
    }
  };

  const intervalId = setInterval(checkStatus, 300000);

  setTimeout(() => {
    clearInterval(intervalId);
    api.sendMessage(`🚫 Monitoring of ${url} has been stopped.`, threadID, messageID);
    console.log(`[${new Date().toISOString()}] Monitoring of ${url} has been stopped.`);

    setTimeout(() => {
      startMonitoring(api, url, threadID, messageID);
    }, 86400000);
  }, 86400000);

  api.sendMessage(`🆙 Monitoring ${url} for uptime.`, threadID, messageID);
  console.log(`[${new Date().toISOString()}] Started monitoring ${url}.`);

  monitoringData[url] = {
    intervalId,
    startTimestamp: startTime
  };
}

module.exports = {
  config: {
  name: 'u',
    version: '2.5',
    author: 'ambot',
    role: 0,
    category: 'utility',
},

onStart: async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const urlToMonitor = args[0];

  if (!urlToMonitor) {
    api.sendMessage("🚀 | Please provide a URL to monitor.", threadID, messageID);
    return;
  }

  if (!urlToMonitor.startsWith("https://")) {
    api.sendMessage("❎ Invalid URL. Please make sure the URL starts with \"https://\".", threadID, messageID);
    return;
  }

  if (monitoringData[urlToMonitor]) {
    api.sendMessage(`🆙 Monitoring of ${urlToMonitor} is already active.`, threadID, messageID);
    return;
  }

  startMonitoring(api, urlToMonitor, threadID, messageID);
  console.log(`[${new Date().toISOString()}] Monitoring ${urlToMonitor} for uptime.`);
}
};

// Start monitoring for URLs in the monitoringData object
for (const url in monitoringData) {
  if (monitoringData.hasOwnProperty(url)) {
    startMonitoring(api, url, threadID, messageID);
  }
}