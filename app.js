/**
 * Example of using our first core module (http) to create a simple http server.
 */
"use strict";
const http = require("http");

let server = http.createServer((request, response) => {
  console.log("I got your request!");
  response.write("Hello from a Node Server!");
  response.end();
});

const PORT = process.env.PORT || 8000;
server.listen(PORT);
