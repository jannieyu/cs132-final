"use strict";
const express = require("express");
const app = express();

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT + "...");
});

// http://localhost:8000/hello
app.get("/hello", function (req, res) {
  res.type("text"); // same as above
  res.send("Hello World!");
});

//localhost:8000/
// http: app.get("/", (req, res) => {
//   console.log("I got your request!");
//   // res.json also sets the response type to application/json appropriately
//   res.json({ msg: ["Hello", "world"] });
// });

// http://localhost:8000/jannie
// app.get("/:name", (req, res) => {
//   res.type("text"); // don't forget to set the response type to change from HTML default
//   let name = req.params["name"];
//   res.send(`Hello ${name}!`);
// });

// Example request using query parameters (optional for this path)
// http://localhost:8000/cityInfo?state=CA&city=SD
app.get("/cityInfo", (req, res) => {
  res.type("text");
  let state = req.query["state"];
  let city = req.query["city"];
  if (state && city) {
    res.send(`State: ${state}, city: ${city}`);
  } else {
    res.status(400).send("Missing required state and city parameters.");
  }
});

// http://localhost:8000/states/CA/cities/SD
// Example request using path parameters instead (required to hit this route path)
// This is generally more common for Express APIs than the above option.
app.get("/states/:state/cities/:city", (req, res) => {
  let state = req.params["state"];
  let city = req.params["city"];
  res.json({ state: state, city: city });
});
