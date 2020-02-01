const express = require("express");
const http = require('http');

const app = express();
const port = 8080;
//const port = 80;


app.use(express.static(__dirname + "/public"));


app.get("/",  (req, res) => {
	res.sendFile( __dirname + "/views/index.html");
});

let server = http.createServer(app).listen(port);//, () => console.log("I work"));

const io = require("socket.io")(server);

io.on("connection", (socket)=>
  {
    console.log("socketed");
  });
