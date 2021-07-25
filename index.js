require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const axios = require("axios");
const parseString = require("xml2js").parseString;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Online!");
});
app.post("/poc", (req, res) => {
  Promise.all(
    req.body.map((url) =>
      axios.get(url).then((content) => {
        let parsedItems;
        parseString(content.data, (err, xml) => {
          if (xml?.rss?.channel?.[0]?.item)
            parsedItems = xml.rss.channel[0].item;
          else parsedItems = [];
        });
        return parsedItems;
      })
    )
  ).then((allXML) => {
    res.send(allXML.reduce((acc, curr) => [...acc, ...curr]));
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server ready on port ${process.env.PORT}`)
);
