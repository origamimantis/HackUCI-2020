const express = require("express");
const http = require('http');

const app = express();
const port = 8080;
//const port = 80;


app.use(express.static(__dirname + "/public"));


app.get("/",  (req, res) => {
	console.log("access");
	res.sendFile( __dirname + "/views/index.html");
});

http.createServer(app).listen(port, () => console.log("I work"));
