const express = require("express");
const http = require('http');

const app = express();
const port = 80;




app.get("/",  (req, res) => {
	console.log("access");
	res.sendfile("views/index.html");
});

http.createServer(app).listen(port, () => console.log("I work"));
