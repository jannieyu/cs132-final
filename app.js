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
 */

"use strict";
const express = require("express");
const app = express();
const mysql = require("promise-mysql");
const multer = require("multer");

const SERVER_ERR_CODE = 500;
const SERVER_ERROR =
  "Something went wrong on the server, please try again later.";
const CLIENT_ERR_CODE = 400;
const CLIENT_ERROR =
  "Bad client request; missing parameters. Please try again.";
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

// Once we set up the connection with required credentials, we try to connect so we
// can query on the connected object.
/**
 *
 * @param {string} qry - SQL query to retrieve table rows from the jewelrydb
 * database
 * @param {Array} inputs - an array of inputs
 * @returns
 */
async function queryDB(qry, inputs) {
  let db;
  try {
    db = await getDB(); // connection error thrown in getDB();
    let rows;
    if (inputs.length != 0) {
      rows = await db.query(qry, inputs);
    } else {
      rows = await db.query(qry);
    }

    return rows;
  } catch (err) {
    console.log(err.message);
  }
  db.end(); // TypeError: Cannot read property 'end' of undefined
}

// Endpoint to get all jewelry
app.get("/jewelry", async function (req, res) {
  res.type("json");

  let type = req.query["type"];
  let color = req.query["color"];
  let style = req.query["style"];
  let priceLimit = req.query["price"];

  let input = [];
  let queryRestrictions = [];

  // Append to the input list as necessary depending on which query parameters
  // are specified
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

  // Trying to extract the promisified query results, otherwise use error
  // handling
  try {
    let val = await queryDB(qry, input);

    // Check for empty values and return 200/400 error
    if (val.length !== 0) {
      res.send(val);
    } else {
      res.status(CLIENT_ERR_CODE).send(CLIENT_ERROR);
    }
  } catch (err) {
    res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }

});

// Endpoint to get information about just one product using id
app.get("/jewelry/:id", async function (req, res) {
  res.type("json");
  let qry = "SELECT * FROM jewelry WHERE id=?";
  let input = [req.params.id];

  try {
    let val = await queryDB(qry, input);

    // Check for empty values and return 200/400 error
    if (val.length !== 0) {
      res.send(val);
    } else {
      res.status(CLIENT_ERR_CODE).send(CLIENT_ERROR);
    }
  } catch (err) {
    res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});

// Endpoint used to post information from a contact request
app.post("/contact", async function (req, res) {
  res.type("text");

  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let timestamp = new Date();

  let qry =
    "INSERT INTO contact_info (contact_name, email, time_submitted, contact_msg)" +
    " VALUES(?, ?, ?, ?)";
  let input = [name, email, timestamp, message];
  console.log(qry);
  console.log(input);

  if (!(name && email && message && timestamp)) {
    res.status(CLIENT_ERR_CODE).send(CLIENT_ERROR);
  }

  // Trying to extract the promisified query results, otherwise use error
  // handling
  try {
    let val = await queryDB(qry, input);
    res.send("Message successfully sent.");
  } catch (err) {
    res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});

// Endpoint to get random jewelry set
app.get("/random", async function (req, res) {
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
  try {
    let val = await queryDB(qry, NO_INPUT);

    // Check for empty values and return 200/400 error
    if (val.length !== 0) {
      res.send(val);
    } else {
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
  } catch (err) {
    res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});

// Endpoint to get faq
app.get("/faq", async function (req, res) {
  res.type("json");
  let qry = "SELECT * FROM faq";

  // Trying to extract the promisified query results, otherwise use error
  // handling
  try {
    let val = await queryDB(qry, NO_INPUT);

    // Check for empty values and return 200/400 error
    if (val.length !== 0) {
      res.send(val);
    } else {
      res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
    }
  } catch (err) {
    res.status(SERVER_ERR_CODE).send(SERVER_ERROR);
  }
});
