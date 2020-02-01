const express = require("express");
const fs = require("fs");
const https = require('https');

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/applenoodlesmoothie.tech/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/applenoodlesmoothie.tech/fullchain.pem")

}



const app = express();
//const port = 8080;
const port = 443;


app.use(express.static(__dirname + "/public"));


app.get("/",  (req, res) => {
	res.sendFile( __dirname + "/views/index.html");
});

let server = https.createServer(options, app).listen(port, () => console.log("I 80"));

const io = require("socket.io")(server);

io.on("connection", (socket)=>
  {
    console.log("socketed");
  });
