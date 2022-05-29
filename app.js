/**
 * @author Jennie Chung, Jannie Yu
 * CS132 Spring 2022
 *
 * Server side js code for jewelry store API.
 * This API has the following endpoints:
 * GET /jewelry
 * GET /jewelry/:random
 * GET /jewelry?type=__&price=__&color=__&dateListed=__&style=__
 * POST /contact
 * POST /addItem
 */

"use strict";
const fs = require("fs");
const fsp = require("fs/promises"); // fsp just for demo
const express = require("express");
const app = express();

const jewelryData = [
  {
    productName: "Thick Crystal Crusted Gold Ring",
    image: "img/thick_crusted_ring.jpg",
    type: "ring",
    price: 29.99,
    color: "gold",
    style: "casual",
  },
  {
    productName: "Yellow Topaz Tooth Earrings",
    image: "img/topaz_tooth_earrings.jpg",
    type: "earring",
    price: 39.99,
    color: "yellow",
    style: "formal",
  },
  {
    productName: "Olive Leaf Ring",
    image: "img/olive_tree_ring.jpg",
    type: "ring",
    price: 59.99,
    color: "gold",
    style: "casual",
  },
  {
    productName: "Thin Moon Cresent Necklace",
    image: "img/moon_necklace.jpg",
    type: "necklace",
    price: 19.99,
    color: "pink",
    style: "casual",
  },
  {
    productName: "Gold Ruby Necklace",
    image: "img/ruby_necklace.jpg",
    type: "necklace",
    price: 29.99,
    color: "red",
    style: "casual",
  },
  {
    productName: "Silver Drop Necklace",
    image: "img/drop_necklace.jpg",
    type: "necklace",
    price: 39.99,
    color: "silver",
    style: "formal",
  },
];

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT + "...");
});

app.get("/jewelry", function (req, res) {
  res.type("json"); // same as above
  res.send(jewelryData);
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
