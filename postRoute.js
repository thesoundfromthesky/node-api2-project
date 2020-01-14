const express = require("express");
const post = require("./data/db");
const router = express.Router();

// | Method | Endpoint                | Description                                                                                                                                                                 |
// | ------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

// | GET    | /api/posts              | Returns an array of all the post objects contained in the database.                                                                                                         |
router.get("/", (req, res) => {
    res.status(200).send("working");
});

// | GET    | /api/posts/:id          | Returns the post object with the specified id.                                                                                                                              |
router.get("/:id", (req, res) => {
    res.status(200).send("working");
});

// | GET    | /api/posts/:id/comments | Returns an array of all the comment objects associated with the post with the specified id.                                                                                 |
router.get("/:id/comments", (req, res) => {
    res.status(200).send("working");
});

// | POST   | /api/posts              | Creates a post using the information sent inside the `request body`.                                                                                                        |
router.post("/", (req, res) => {
    res.status(200).send("working");
});

// | POST   | /api/posts/:id/comments | Creates a comment for the post with the specified id using information sent inside of the `request body`.                                                                   |
router.post("/:id/comments", (req, res) => {
    res.status(200).send("working");
});

// | PUT    | /api/posts/:id          | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.
router.put("/:id", (req, res) => {
    res.status(200).send("working");
});

// | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement. |
router.delete("/:id", (req, res) => {
    res.status(200).send("working");
});
module.exports = router;
