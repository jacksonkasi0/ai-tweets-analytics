const express = require("express");
const cors = require("cors");
const OAuth = require("oauth");
const needle = require("needle");
const { promisify } = require("util");
const {
  TextAnalyticsClient,
  AzureKeyCredential,
} = require("@azure/ai-text-analytics");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = process.env.TWITTER_BEARER_TOKEN;

const azureEndpoint = process.env.ENDPOINT;
const azureKey = process.env.AZURE_KEY;

const textAnalyticsClient = new TextAnalyticsClient(
  azureEndpoint,
  new AzureKeyCredential(azureKey)
);

async function getFromTwitter(username, type) {
  const oauth = new OAuth.OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    "1.0A",
    null,
    "HMAC-SHA1"
  );

  const get = promisify(oauth.get.bind(oauth));

  console.log(new Date(), type, username);

  if (type === "user-data") {
    // user details
    const userData = await get(
      `https://api.twitter.com/1.1/users/show.json?screen_name=${username}`,
      process.env.TWITTER_ACCESS_KEY,
      process.env.TWITTER_ACCESS_TOKEN_SECRET
    );
    return JSON.parse(userData);
  }
  if (type === "user-timeline") {
    // user timeline
    const userTimeline = await get(
      `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=10`,
      process.env.TWITTER_ACCESS_KEY,
      process.env.TWITTER_ACCESS_TOKEN_SECRET
    );
    return JSON.parse(userTimeline);
  }
  if (type === "user-tweets") {
    // user tweets
    const userTweets = await needle(
      "get",
      `https://api.twitter.com/2/users/${username}/tweets?tweet.fields=public_metrics`,
      {
        headers: {
          authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return userTweets.body;
  }
  if (type === "tweets-analyze") {
    const sentimentResult = await textAnalyticsClient.analyzeSentiment(
      username
    );
    return sentimentResult.map((document) => {
      return {
        id: document.id,
        sentiment: document.sentiment,
        score: [
          document.confidenceScores.positive.toFixed(2) * 100,
          document.confidenceScores.neutral.toFixed(2) * 100,
          document.confidenceScores.negative.toFixed(2) * 100,
        ],
      };
    });
  }
  if (type === "tweets-wiki") {
    const wikilinks = await textAnalyticsClient.recognizeLinkedEntities(
      username
    );
    const wiki = wikilinks.map((wiki) => wiki.entities.map((data) => data));
    return wiki;
  } else {
    // search users
    const searchUser = await get(
      `https://api.twitter.com/1.1/users/search.json?q=${username}&count=6`,
      process.env.TWITTER_ACCESS_KEY,
      process.env.TWITTER_ACCESS_TOKEN_SECRET
    );
    return JSON.parse(searchUser);
  }
}

app.get("/", (req, res) => {
  res.send("ai tweets analytics backend");
});

app.get("/search/:user", (req, res) => {
  getFromTwitter(req.params.user, "search-user")
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.get("/getuser/:user", (req, res) => {
  getFromTwitter(req.params.user, "user-data")
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.get("/timeline/:user", (req, res) => {
  getFromTwitter(req.params.user, "user-timeline")
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.get("/tweets/:user", (req, res) => {
  getFromTwitter(req.params.user, "user-tweets")
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.post("/tweetsanalyze", (req, res) => {
  getFromTwitter(req.body, "tweets-analyze")
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.post("/tweetswiki", (req, res) => {
  getFromTwitter(req.body, "tweets-wiki")
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.listen(PORT, () => {
  console.log(`server is running in the port: ${PORT}`);
});
