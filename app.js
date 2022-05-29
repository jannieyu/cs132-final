/**
 * @author Jennie Chung, Jannie Yu
 * CS132 Spring 2022
 * 
 * Server side js code for jewelry store API. 
 * This API has the following endpoints:
 * GET /jewelry
 * GET /jewelry/random
 * GET /jewelry?type=__&price=__&color=__&date-listed=__&style=__
 */

"use strict";
const express = require("express");
const app = express();
const jewelryData = getJewelryData();

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT + "...");
});

// Endpoint to get all jewelry
app.get("/jewelry", function (req, res) {
  res.type("json"); // same as above
  res.send(jewelryData);
});

// Endpoint to get jewelry with extra parameters
app.get("/jewelry", function (req, res) {
  res.type("json");
  let type = req.query["type"];
  let price = req.query["price"];
  let color = req.query["color"];
  let dataListed = req.query["date-listed"];
  let style = req.query["style"];

  // Based on what parameters are specified in the query, return appropriate
  // json
  if (type) {
    res.send();
  } else {
    res.status(400).send("Missing required state and city parameters.");
  }
}); 

// Endpoint to get random jewelry set 
app.get("/jewelry/random", function (req, res) {
  res.type("json");
  // Return a random set of jewelry
  res.send();
});
