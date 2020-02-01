const express = require("express");
const http = require('http');

const app = express();
const port = 80;



app.use(express.static(__dirname + '/public'));
app.set("views", __dirname + "/views");

app.get("/",  (req, res) => {
	console.log("access");
	res.render("index");
});

http.createServer(app).listen(port, () => console.log("I work"));
