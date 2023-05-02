const fetch = require("node-fetch");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 8081;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (origin) res.header("Access-Control-Allow-Origin", origin);
  next();
});

app.get("/", async function (req, res) {
  if (req.query.id) {
    try {
      const { data } = await (
        await fetch(
          `https://api.bilibili.com/x/player/pagelist?bvid=${req.query.id}&jsonp=jsonp`
        )
      ).json();
      const text = await (
        await fetch(
          `https://api.bilibili.com/x/v1/dm/list.so?oid=${data[0].cid}`
        )
      ).text();
      res.type("application/xml");
      res.send(text);
    } catch (error) {
      return res.status(503).send(`Failed to get danmu: ${error.message}`);
    }
  } else {
    return res.status(503).send("Missing query: id");
  }
});

app.listen(PORT, () => console.log(PORT));

module.exports = app;
