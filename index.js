const express = require("express");
const postRoute = require("./postRoute");

const server = express();
const port = 8000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/posts", postRoute);

server.listen(port, () => {
  console.log(`Server on ${port}`);
});
