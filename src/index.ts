import dotenv from "dotenv";
dotenv.config();

import express from "express";
import axios from "axios";
import { parseString } from "xml2js";
import convert from "xml-js";
import { FeedItem } from "./model/rss/FeedItem";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Online!");
});
app.post("/poc", (req, res) => {
  Promise.all(
    req.body.map((url) =>
      axios.get(url).then((content) => {
        /*let parsedItems;
        parseString(content.data, (err, xml) => {
          if (xml?.rss?.channel?.[0]?.item)
            parsedItems = xml.rss.channel[0].item;
          else parsedItems = [];
        });
        return parsedItems;*/
        return JSON.parse(
          convert.xml2json(content.data, { compact: true })
        ).rss.channel.item.map((item): FeedItem => {
          return {
            title: item.title._text,
            description: item.description._text,
            pubDate: item.pubDate._text,
            enclosure: {
              url: item.enclosure._attributes.url,
              type: item.enclosure._attributes.type,
            },
          };
        });
      })
    )
  ).then((allXML) => {
    res.send(allXML.reduce((acc: Array<any>, curr: any) => [...acc, ...curr]));
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server ready on port ${process.env.PORT}`)
);
