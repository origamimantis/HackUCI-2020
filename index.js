const express = require("express");

const app = express();
const port = 4141;



app.set("views", __dirname + "/views");
app.set("view engine", "html");


app.get("/",  (req, res) => {
	console.log("access");
	res.render("index");
});

app.listen(port, () => console.log("I work"));
