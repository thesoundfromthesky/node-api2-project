const express = require("express");
const posts = require("./data/db");
const router = express.Router();

// | Method | Endpoint                | Description                                                                                                                                                                 |
// | ------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

// | GET    | /api/posts              | Returns an array of all the post objects contained in the database.
// When the client makes a `GET` request to `/api/posts`:

// - If there's an error in retrieving the _posts_ from the database:
//   - cancel the request.
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ error: "The posts information could not be retrieved." }`.                                                                                                       |
router.get("/", (req, res) => {
  posts
    .find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// | GET    | /api/posts/:id          | Returns the post object with the specified id.
// When the client makes a `GET` request to `/api/posts/:id`:

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

// - If there's an error in retrieving the _post_ from the database:
//   - cancel the request.
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ error: "The post information could not be retrieved." }`.                                                                                                                         |
router.get("/:id", (req, res) => {
  const id = req.params.id;
  posts
    .findById(id)
    .then(post => {
      if (post && post.length) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// | GET    | /api/posts/:id/comments | Returns an array of all the comment objects associated with the post with the specified id.                                                                                 |
// When the client makes a `GET` request to `/api/posts/:id/comments`:

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

// - If there's an error in retrieving the _comments_ from the database:
//   - cancel the request.
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ error: "The comments information could not be retrieved." }`.
router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  posts
    .findPostComments(id)
    .then(comments => {
      if (comments && comments.length) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

// | POST   | /api/posts              | Creates a post using the information sent inside the `request body`.
// When the client makes a `POST` request to `/api/posts`:

// - If the request body is missing the `title` or `contents` property:

//   - cancel the request.
//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ errorMessage: "Please provide title and contents for the post." }`.

// - If the information about the _post_ is valid:

//   - save the new _post_ the the database.
//   - return HTTP status code `201` (Created).
//   - return the newly created _post_.

// - If there's an error while saving the _post_:
//   - cancel the request.
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON object: `{ error: "There was an error while saving the post to the database" }`.                                                                                                       |
router.post("/", (req, res) => {
  if (req.body.title && req.body.contents) {
    posts
      .insert(req.body)
      .then(id => {
        posts.findById(id.id).then(post => {
          res.status(201).json(post);
        });
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

// | POST   | /api/posts/:id/comments | Creates a comment for the post with the specified id using information sent inside of the `request body`.                                                                   |
// When the client makes a `POST` request to `/api/posts/:id/comments`:

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

// - If the request body is missing the `text` property:

//   - cancel the request.
//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ errorMessage: "Please provide text for the comment." }`.

// - If the information about the _comment_ is valid:

//   - save the new _comment_ the the database.
//   - return HTTP status code `201` (Created).
//   - return the newly created _comment_.

// - If there's an error while saving the _comment_:
//   - cancel the request.
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON object: `{ error: "There was an error while saving the comment to the database" }`.
router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  req.body.post_id = id;
  if (req.body.text) {
    posts
      .findById(id)
      .then(post => {
        if (post && post.length) {
          posts
            .insertComment(req.body)
            .then(id => {
              posts.findCommentById(id.id).then(comment => {
                res.status(201).json(comment);
              });
            })
            .catch(err => {
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database"
              });
            });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The posts information could not be retrieved." });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
});

// | PUT    | /api/posts/:id          | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.
// When the client makes a `PUT` request to `/api/posts/:id`:

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

// - If the request body is missing the `title` or `contents` property:

//   - cancel the request.
//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ errorMessage: "Please provide title and contents for the post." }`.

// - If there's an error when updating the _post_:

//   - cancel the request.
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ error: "The post information could not be modified." }`.
router.put("/:id", (req, res) => {
  const id = req.params.id;
  if (req.body.title && req.body.contents) {
    posts
      .findById(id)
      .then(post => {
        if (post && post.length) {
          posts.update(id, req.body).then(() => {
            posts.findById(id).then(post => res.status(200).json(post));
          });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The posts information could not be retrieved." });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

// | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement. |
// When the client makes a `DELETE` request to `/api/posts/:id`:

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

// - If there's an error in removing the _post_ from the database:
//   - cancel the request.
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ error: "The post could not be removed" }`.
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  posts
    .findById(id)
    .then(post => {
      if (post && post.length) {
        posts.remove(id).then(id => res.sendStatus(204));
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});
module.exports = router;
