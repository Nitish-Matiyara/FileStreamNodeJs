const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/video", async (req, res) => {
  console.log(req.headers);

  //--Ensuring range given for video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires range header");
  }

  //--Video stats
  const videoPath = "demo.mp4";
  const videoSize = fs.statSync("demo.mp4").size;

  console.log(videoSize);

  //--Parse Range
  //--Example bytes = 543270~
  const CHUNK_SIZE = 10 ** 6; //1MB = 100000
  const start = Number(range.replace(/\D/g, "")); //543270~ = 543270
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  console.log(start, end);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Range": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

app.listen(8002, () => {
  console.log("Server running on port 8002");
});
