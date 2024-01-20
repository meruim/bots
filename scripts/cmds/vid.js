const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs-extra");
const { getStreamFromURL, downloadFile } = global.utils;

async function getStreamAndSize(url, path = "") {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    headers: {
      Range: "bytes=0-",
    },
  });
  if (path) response.data.path = path;
  const totalLength = response.headers["content-length"];
  return {
    stream: response.data,
    size: totalLength,
  };
}

module.exports = {
  config: {
    name: "video",
    version: "1.12",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    shortDescription: "YouTube",
    longDescription: {
      en: "Download video, audio or view video information on YouTube",
    },
    category: "media",
    guide: {
      en:
        "   {pn} [video|-v] [<video name>|<video link>]: use to download video from youtube." +
        "\n   {pn} [audio|-a] [<video name>|<video link>]: use to download audio from youtube" +
        "\n   {pn} [info|-i] [<video name>|<video link>]: use to view video information from youtube" +
        "\n   Example:" +
        "\n    {pn} -v Fallen Kingdom" +
        "\n    {pn} -a Fallen Kingdom" +
        "\n    {pn} -i Fallen Kingdom",
    },
  },

  langs: {
    en: {
      error: "❌ An error occurred: %1",
      noResult: "⭕ No search results match the keyword %1",
      video: "video",
      audio: "audio",
      downloading: '⬇️ Downloading %1 "%2"',
      downloading2:
        '⬇️ Downloading %1 "%2"\n🔃 Speed: %3MB/s\n⏸️ Downloaded: %4/%5MB (%6%)\n⏳ Estimated time remaining: %7 seconds',
      noVideo: "⭕ Sorry, no video was found with a size less than 83MB",
      noAudio: "⭕ Sorry, no audio was found with a size less than 26MB",
      info: "💠 Title: %1\n🏪 Channel: %2\n👨‍👩‍👧‍👦 Subscriber: %3\n⏱ Video duration: %4\n👀 View count: %5\n👍 Like count: %6\n🆙 Upload date: %7\n🔠 ID: %8\n🔗 Link: %9",
      listChapter: "\n📖 List chapter: %1\n",
    },
  },
  onStart: async function () {},
  onChat: async function ({ args, message, event, commandName, getLang }) {
    const input = event.body;
    if (
      (input && input.trim().toLowerCase().startsWith("vid")) ||
      (input && input.trim().toLowerCase().startsWith("video"))
    ) {
      const datas = input.split(" ");
      datas.shift();
      const keyWord = datas.join(" ");
      let type;
      type = "video";

      const checkurl =
        /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      const urlYtb = checkurl.test(args[1]);

      if (urlYtb) {
        const infoVideo = await getVideoInfo(keyWord);
        handle({ type, infoVideo, message, downloadFile, getLang });
        return;
      }

      // const keyWord = args.join(" ");
      const maxResults = 6;

      let result;
      try {
        result = (await search(keyWord)).slice(0, maxResults);
      } catch (err) {
        return message.reply(getLang("error", err.message));
      }
      if (result.length == 0)
        return message.reply(getLang("noResult", keyWord));

      const infoChoice = result[0]; // Automatically choose the first result
      const idvideo = infoChoice.id;
      const infoVideo = await getVideoInfo(idvideo);
      await handle({ type, infoVideo, message, getLang });
    }
  },
};

async function handle({ type, infoVideo, message, getLang }) {
  const { title, videoId } = infoVideo;

  if (type == "video") {
    const MAX_SIZE = 87031808; // 83MB (max size of video that can be sent on fb)
    const msgSend = message.reply(
      getLang("downloading", getLang("video"), title)
    );
    const { formats } = await ytdl.getInfo(videoId);
    const getFormat = formats
      .filter((f) => f.hasVideo && f.hasAudio)
      .sort((a, b) => b.contentLength - a.contentLength)
      .find((f) => f.contentLength || 0 < MAX_SIZE);
    if (!getFormat) return message.reply(getLang("noVideo"));
    const getStream = await getStreamAndSize(getFormat.url, `${videoId}.mp4`);
    if (getStream.size > MAX_SIZE) return message.reply(getLang("noVideo"));

    const savePath = __dirname + `/tmp/${videoId}_${Date.now()}.mp4`;
    const writeStrean = fs.createWriteStream(savePath);
    const startTime = Date.now();
    getStream.stream.pipe(writeStrean);
    const contentLength = getStream.size;
    let downloaded = 0;
    let count = 0;

    getStream.stream.on("data", (chunk) => {
      downloaded += chunk.length;
      count++;
      if (count == 5) {
        const endTime = Date.now();
        const speed = (downloaded / (endTime - startTime)) * 1000;
        const timeLeft =
          ((contentLength / downloaded) * (endTime - startTime)) / 1000;
        const percent = (downloaded / contentLength) * 100;
        if (timeLeft > 30)
          // if time left > 30s, send message
          message.reply(
            getLang(
              "downloading2",
              getLang("video"),
              title,
              Math.floor(speed / 1000) / 1000,
              Math.floor(downloaded / 1000) / 1000,
              Math.floor(contentLength / 1000) / 1000,
              Math.floor(percent),
              timeLeft.toFixed(2)
            )
          );
      }
    });
    writeStrean.on("finish", () => {
      message.reply(
        {
          body: title,
          attachment: fs.createReadStream(savePath),
        },
        async (err) => {
          if (err) return message.reply(getLang("error", err.message));
          fs.unlinkSync(savePath);
          message.unsend((await msgSend).messageID);
        }
      );
    });
  }
}

async function search(keyWord) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      keyWord
    )}`;
    const res = await axios.get(url);
    const getJson = JSON.parse(
      res.data.split("ytInitialData = ")[1].split(";</script>")[0]
    );
    const videos =
      getJson.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer.contents;
    const results = [];
    for (const video of videos)
      if (video.videoRenderer?.lengthText?.simpleText)
        // check is video, not playlist or channel or live
        results.push({
          id: video.videoRenderer.videoId,
          title: video.videoRenderer.title.runs[0].text,
          thumbnail: video.videoRenderer.thumbnail.thumbnails.pop().url,
          time: video.videoRenderer.lengthText.simpleText,
          channel: {
            id: video.videoRenderer.ownerText.runs[0].navigationEndpoint
              .browseEndpoint.browseId,
            name: video.videoRenderer.ownerText.runs[0].text,
            thumbnail:
              video.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails
                .pop()
                .url.replace(/s[0-9]+\-c/g, "-c"),
          },
        });
    return results;
  } catch (e) {
    const error = new Error("Cannot search video");
    error.code = "SEARCH_VIDEO_ERROR";
    throw error;
  }
}

async function getVideoInfo(id) {
  // get id from url if url
  id = id.replace(/(>|<)/gi, "").split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  id = id[2] !== undefined ? id[2].split(/[^0-9a-z_\-]/i)[0] : id[0];

  const { data: html } = await axios.get(`https://youtu.be/${id}?hl=en`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36",
    },
  });
  const json = JSON.parse(
    html.match(/var ytInitialPlayerResponse = (.*?});/)[1]
  );
  const json2 = JSON.parse(html.match(/var ytInitialData = (.*?});/)[1]);
  const { title, lengthSeconds, viewCount, videoId, thumbnail, author } =
    json.videoDetails;
  let getChapters;
  try {
    getChapters =
      json2.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer.markersMap.find(
        (x) => x.key == "DESCRIPTION_CHAPTERS" && x.value.chapters
      ).value.chapters;
  } catch (e) {
    getChapters = [];
  }
  const owner =
    json2.contents.twoColumnWatchNextResults.results.results.contents.find(
      (x) => x.videoSecondaryInfoRenderer
    ).videoSecondaryInfoRenderer.owner;
  const result = {
    videoId,
    title,
    video_url: `https://youtu.be/${videoId}`,
    lengthSeconds: lengthSeconds.match(/\d+/)[0],
    viewCount: viewCount.match(/\d+/)[0],
    uploadDate: json.microformat.playerMicroformatRenderer.uploadDate,
    likes:
      json2.contents.twoColumnWatchNextResults.results.results.contents
        .find((x) => x.videoPrimaryInfoRenderer)
        .videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons.find(
          (x) => x.segmentedLikeDislikeButtonRenderer
        )
        .segmentedLikeDislikeButtonRenderer.likeButton.toggleButtonRenderer.defaultText.accessibility?.accessibilityData.label.replace(
          /\.|,/g,
          ""
        )
        .match(/\d+/)?.[0] || 0,
    chapters: getChapters.map((x, i) => {
      const start_time = x.chapterRenderer.timeRangeStartMillis;
      const end_time =
        getChapters[i + 1]?.chapterRenderer?.timeRangeStartMillis ||
        lengthSeconds.match(/\d+/)[0] * 1000;

      return {
        title: x.chapterRenderer.title.simpleText,
        start_time_ms: start_time,
        start_time: start_time / 1000,
        end_time_ms: end_time - start_time + start_time,
        end_time: (end_time - start_time + start_time) / 1000,
      };
    }),
    thumbnails: thumbnail.thumbnails,
    author: author,
    channel: {
      id: owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint.browseId,
      username:
        owner.videoOwnerRenderer.navigationEndpoint.browseEndpoint
          .canonicalBaseUrl,
      name: owner.videoOwnerRenderer.title.runs[0].text,
      thumbnails: owner.videoOwnerRenderer.thumbnail.thumbnails,
      subscriberCount: parseAbbreviatedNumber(
        owner.videoOwnerRenderer.subscriberCountText.simpleText
      ),
    },
  };

  return result;
}

function parseAbbreviatedNumber(string) {
  const match = string
    .replace(",", ".")
    .replace(" ", "")
    .match(/([\d,.]+)([MK]?)/);
  if (match) {
    let [, num, multi] = match;
    num = parseFloat(num);
    return Math.round(
      multi === "M" ? num * 1000000 : multi === "K" ? num * 1000 : num
    );
  }
  return null;
}
