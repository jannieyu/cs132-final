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

const mysql = require("mysql");

// Define the credentials for the database connection
let connection = mysql.createConnection({
  host: "localhost",
  port: "3306", // you can find the port in phpMyAdmin or your mysql config
  user: "root",
  password: "",
  database: "jewelrydb",
});

// Once we set up the connection with required credentials, we try to connect so we
// can query on the connected object.
connection.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log("Connected!");
});

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
