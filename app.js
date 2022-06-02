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
 * Function to validate jewelry type.
 * @param {String} type - jewelry type, e.g. necklace, ring
 * @returns boolean - true if valid, false otherwise
 */
function validJewelryType(type) {
  return (type === "necklace" || type === "ring" || type === "earring");
}

/**
 * Function to validate jewelry color.
 * @param {String} color - jewelry color, e.g. red, yellow
 * @returns boolean - true if valid, false otherwise
 */
function validJewelryColor(color) {
  return(
      color === "red" ||
      color === "yellow" ||
      color === "gold" ||
      color === "blue" ||
      color === "silver" ||
      color === "brown" ||
      color === "dual"
    );
}

/**
 * Function to validate jewelry style.
 * @param {String} style - jewelry style, e.g. casual, formal
 * @returns boolean - true if valid, false otherwise
 */
function validJewelryStyle(style) {
  return (style === "casual" || style === "formal");
}

/**
 * Function to validate jewelry price limit.
 * @param {number} price - jewelry price limit
 * @returns boolean - true if valid, false otherwise
 */
function validJewelryPriceLimit(price) {
  return !(isNaN(price) || price === 0);
}

/**
 * Function to build a string used to query the jewelry database for the 
 * appropriate data. The query string is based on the specified type, color,
 * style, and price query parameters from the request, which are all optional.
 * If no valid parameters are specified, all jewelry will be returned.
 * 
 * @returns a string for querying the jewelry database
 */
function buildQueryString(req, res, next) {
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
      if (!validJewelryType(type)) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Bad client request: invalid jewelry type."));
        return;
      }
      queryRestrictions.push("prod_type = ? ");
      input.push(type);
    }
    if (color) {
      if (!validJewelryColor(color)) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Bad client request: invalid jewelry color."));
        return;
      }
      queryRestrictions.push("color = ? ");
      input.push(color);
    }
    if (style) {
      if (!validJewelryStyle(style)) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Bad client request: invalid jewelry style."));
        return;
      }
      queryRestrictions.push("style = ? ");
      input.push(style);
    }
    if (priceLimit) {
      if (!validJewelryPriceLimit(priceLimit)) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Bad client request: invalid jewelry price limit."));
        return;
      }
      queryRestrictions.push("price < ? ");
      input.push(priceLimit);
    }
  }
  qry += queryRestrictions.join(" AND ");

  res.query = qry;
  res.input = input;

  // Continue to jewelry endpoint 
  next();
}

/**
 * Returns an JSON array of jewelry with the following filters:
 * type, color, style, price.
 * All query parameters in the body are optional (type, color, style, and price
 * are all optional parameters). If no parameters are provided, i.e. the
 * endpoint is just /jewelry, then all jewelry will be returned.
 * 
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
app.get("/jewelry", buildQueryString, async function (req, res, next) {
  let qry = res.query;
  let input = res.input;

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
    res.type("json");
    res.send(rows);
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

/**
 * Returns an JSON array of one jewelry, queried by item ID.
 * id must be a valid ID (i.e. the unique integer ID if a product in the 
 * database) and is required.
 * 
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
  let qry = "SELECT * FROM jewelry WHERE id=?";
  let input = [req.params.id];

  let db;
  try {
    db = await getDB();
    let rows = await db.query(qry, input);
    db.end();
    // Check for invalid item ID
    if (rows.length !== 0) {
      res.type("json");
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
 * All body parameters (name, email, and message) are required (none optional).
 * Response type: text/plain
 * Returns 400 error if missing POST parameters
 * Sends a 500 error if DB failed
 * Sends a success message otherwise.
 */
app.post("/contact", async function (req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let timestamp = new Date();

  let qry =
    "INSERT INTO contact_info (contact_name, email, time_submitted, contact_msg)" +
    " VALUES(?, ?, ?, ?)";
  let input = [name, email, timestamp, message];

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
      db.query(qry, input);
      db.end();
      res.type("text");
      res.send("Message successfully sent! We will look into it shortly.");
    } catch (err) {
      res.status(SERVER_ERR_CODE);
      err.message = SERVER_ERROR;
      next(err);
    }
  }
});

/**
 * Returns an JSON array of a random jewelry set with ring, necklace, earring item.
 * Requires/has no body parameters.
 * Returns 500 error if internal server errors.
 */
app.get("/random", async function (req, res, next) {
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
      res.type("json");
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
 * Requires/has no body parameters.
 * 
 * Example:
 * [{"faq_id":1,
 * "question":"How long does shipping take?",
 * "answer":"Shipping typically \ntakes 2 weeks for U.S. orders.
 * We don't ship internationally yet, but we're \nhoping to expand soon!"}...]
 * Returns 500 error if DB fails.
 */
app.get("/faq", async function (req, res, next) {
  let qry = "SELECT * FROM faq";

  // Extract the promisified query results, otherwise handle error
  let db;
  try {
    db = await getDB();
    let rows = await db.query(qry);
    db.end();

    // Check for empty values and return 200/400 error
    if (rows.length !== 0) {
      res.type("json");
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
