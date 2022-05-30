/**
 * @author Jennie Chung, Jannie Yu
 * CS132 Spring 2022
 *
 * Server side js code for jewelry store API.
 * This API has the following endpoints:
 * GET /jewelry
 * GET /jewelry/random
 * GET /jewelry?type=__&price=__&color=__&date-listed=__&style=__
 * GET /faq
 *
 * POST /contact
 */

"use strict";
const express = require("express");
const app = express();
const mysql = require("promise-mysql");
const multer = require("multer");

const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const SERVER_ERROR = "Internal sever error, please try again later.";
const NO_INPUT = [];

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); // built-in middleware
// for parsing application/json
app.use(express.json()); // built-in middleware
// for parsing multipart/form-data (required with FormData)
app.use(multer().none()); // multer middleware

app.use(express.static("public"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT + "...");
});

/**
 * Establishes a database connection to the jewelrydb and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDB() {
  const db = await mysql.createConnection({
    // Variables for connections to the database.
    host: "localhost", // fill in with server name
    port: "3306", // fill in with a port (will be different mac/pc)
    user: "root", // fill in with username
    password: "mysqlpw", // fill in with password
    database: "jewelrydb", // fill in with db name
  });
  return db;
}

/**
 * Returns an JSON array of jewelry with the following filters:
 * type, color, style, price.
 * Example:
 * [{"id":1,
 * "product_name":"Dual Band Ring",
 * "descrip":"Why have one when you can have two?",
 * "img_path":"img/rings/dual_band_ring.jpg",
 * "prod_type":
 * "ring","price":29.99,
 * "color":"gold",
 * "style":"casual"}, ...]
 * Returns 400 error if invalid GET parameters.
 * Returns 500 error if internal server errors.
 */
app.get("/jewelry", async function (req, res, next) {
  res.type("json");
  let type = req.query["type"];
  let color = req.query["color"];
  let style = req.query["style"];
  let priceLimit = req.query["price"];
  let input = [];
  let queryRestrictions = [];

  // Append to the input list depending on which query parameters are specified
  let qry = "SELECT * FROM jewelry";
  if (type || color || style || priceLimit) {
    qry += " WHERE ";
    if (type) {
      queryRestrictions.push("prod_type = ? ");
      input.push(type);
    }
    if (color) {
      queryRestrictions.push("color = ? ");
      input.push(color);
    }
    if (style) {
      queryRestrictions.push("style = ? ");
      input.push(style);
    }
    if (priceLimit) {
      queryRestrictions.push("price < ? ");
      input.push(priceLimit);
    }
  }
  qry += queryRestrictions.join(" AND ");

  // Extract the promisified query results, otherwise handle error
  let db;
  try {
    db = await getDB();
    let rows;
    if (input == NO_INPUT) {
      rows = await db.query(qry);
    } else {
      rows = await db.query(qry, input);
    }
    db.end();
    res.send(rows);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * Returns an JSON array of one jewelry, queried by item ID.
 * Example:
 * [{"id":1,
 * "product_name":"Dual Band Ring",
 * "descrip":"Why have one when you can have two?",
 * "img_path":"img/rings/dual_band_ring.jpg",
 * "prod_type":
 * "ring","price":29.99,
 * "color":"gold",
 * "style":"casual"}]
 * Returns 400 error if invalid GET parameter ID value.
 * Returns 500 error if internal server errors.
 */
app.get("/jewelry/:id", async function (req, res, next) {
  res.type("json");
  let qry = "SELECT * FROM jewelry WHERE id=?";
  let input = [req.params.id];

  let db;
  try {
    db = await getDB();
    let rows = await db.query(qry, input);
    db.end();
    // Check for invalid item ID
    if (rows.length !== 0) {
      res.send(rows);
    } else {
      res.status(CLIENT_ERR_CODE);
      next(Error("Bad client request: jewelry does not exist."));
    }
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * Endpoint to post contact information filled out by user.
 * Required POST parameters: name, email, message.
 * Response type: text/plain
 * Returns 400 error if missing POST parameters
 * Sends a 500 error if DB failed
 * Sends a success message otherwise.
 */
app.post("/contact", async function (req, res, next) {
  res.type("text");
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let timestamp = new Date();

  let qry =
    "INSERT INTO contact_info (contact_name, email, time_submitted, contact_msg)" +
    " VALUES(?, ?, ?, ?)";
  let input = [
    name.toString(),
    email.toString(),
    timestamp,
    message.toString(),
  ];

  if (!(name && email && message && timestamp)) {
    res.status(CLIENT_ERR_CODE);
    next(
      Error(
        "Bad client request: empty POST parameters name, email, or message in /contact."
      )
    );
  } else {
    // Trying to extract the promisified query results, otherwise use error
    // handling
    let db;
    try {
      db = await getDB();
      let rows = await db.query(qry, input);
      db.end();
      res.send("Message successfully sent! We will look into it shortly.");
    } catch (err) {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
});

/**
 * Returns an JSON array of a random jewelry set
 * with ring, necklace, earring item
 * Returns 500 error if internal server errors.
 */
app.get("/random", async function (req, res, next) {
  res.type("json");

  // Return a random set of jewelry
  const unionString = "UNION ALL ";
  const randString = "ORDER BY RAND() LIMIT 1 ";

  // Select a random necklace
  let qry = "(SELECT * FROM jewelry WHERE prod_type='necklace' ";
  qry += randString + ")" + unionString;

  // Select a random earring
  qry += "(SELECT * FROM jewelry WHERE prod_type='earring' ";
  qry += randString + ")" + unionString;

  // Select a random ring
  qry += "(SELECT * FROM jewelry WHERE prod_type='ring' ";
  qry += randString + ")";

  // Trying to extract the promisified query results, otherwise use error
  // handling
  let db;
  try {
    db = await getDB();
    let rows = await db.query(qry);
    db.end();

    if (rows.length !== 0) {
      res.send(rows);
    } else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * Returns an JSON array of a FAQ questions & answers.
 * Example:
 * [{"faq_id":1,
 * "question":"How long does shipping take?",
 * "answer":"Shipping typically \ntakes 2 weeks for U.S. orders.
 * We don't ship internationally yet, but we're \nhoping to expand soon!"}...]
 * Returns 500 error if DB fails.
 */
app.get("/faq", async function (req, res, next) {
  res.type("json");
  let qry = "SELECT * FROM faq";

  // Extract the promisified query results, otherwise handle error
  let db;
  try {
    db = await getDB();
    let rows = await db.query(qry);
    db.end();

    // Check for empty values and return 200/400 error
    if (rows.length !== 0) {
      res.send(rows);
    } else {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

// Returns error message for middleward stack error handling in plain text.
app.use((err, req, res, next) => {
  res.type("text");
  res.send(err.message);
});
