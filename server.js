const express = require("express");
const fs = require("fs");
const path = require("path")
const app = express();

app.get("/", (req,res)=>{
    res.sendFile(__dirname, "/index.html")

})
app.get("/video", (req,res)=>{
   const videofile = fs.createReadStream("demo.mp4")
videofile.pipe(res)
})
app.listen(8003, () => {
    console.log("Server running on port 8003");
  });
  