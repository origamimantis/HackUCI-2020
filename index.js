const express = require("express");

const app = express();
const port = 4141;



app.set("views", __dirname + "/views");


app.get("/",  (req, res) => {
  res.render("index");
});

app.listen(port, () => console.log("I work"));
