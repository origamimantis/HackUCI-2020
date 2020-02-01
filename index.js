const express = require("express");
const fs = require("fs");
const https = require('https');

//const KEY = "/etc/letsencrypt/live/applenoodlesmoothie.tech/privkey.pem";
//const CERT = "/etc/letsencrypt/live/applenoodlesmoothie.tech/fullchain.pem";

const KEY = "../privkey.pem";
const CERT = "../fullchain.pem";

const options = {
  key: fs.readFileSync(KEY),
  cert: fs.readFileSync(CERT)

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
