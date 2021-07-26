import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import express from "express";
import axios from "axios";
import { parseString } from "xml2js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Online! Pommier Joli !!!!");
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
    res.send(allXML.reduce((acc: Array<any>, curr: any) => [...acc, ...curr]));
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server ready on port ${process.env.PORT}`)
);
