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
    password: "", // fill in with password
    database: "jewelrydb", // fill in with db name
  });
  return db;
}

// Once we set up the connection with required credentials, we try to connect so we
// can query on the connected object.
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

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT + "...");
});

// Endpoint to get all jewelry
app.get("/jewelry", function (req, res) {
  res.type("json"); // same as above
  let type = req.query["type"];
  let color = req.query["color"];
  let style = req.query["style"];

  let input = [];
  let qry = "SELECT * FROM jewelry";
  if (type || color || style) {
    qry += " WHERE ";
    if (type) {
      qry += "prod_type = ? ";
      input.push(type);
    }
    if (color) {
      qry += "color = ? ";
      input.push(color);
    }
    if (style) {
      qry += "style = ? ";
      input.push(style);
    }
  }
  queryDB(qry, input).then((val) => res.send(val));
});

// Endpoint to get jewelry with extra parameters
app.get("/jewelry", function (req, res) {
  res.type("json");

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

// Endpoint to get faq 
app.get("/faq", function (req, res) {
  res.type("json");
  let qry = "SELECT * FROM faq";
  queryDB(qry, input).then((val) => res.send(val));
});
