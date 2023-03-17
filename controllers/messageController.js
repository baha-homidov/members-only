const Message = require("../models/message");
const { body, check, validationResult } = require("express-validator"); // validator library for serverside validation
const user = require("../models/user");

// Retrieve all messages from backend and dispaly them
exports.index = (req, res) => {
  res.send("NOT IMPLEMENTED: Index page");
};

// Display message create form form on GET
exports.message_create_get = (req, res, next) => {
  // if user is not logged in redirect to sign in page
  if (!res.locals.currentUser) {
    res.redirect("/sign-in");
  }
  res.render("pages/postmessage", {
    title: "Create a message",
  });
};

// Display message create form on POST
exports.message_create_post = [
  // Validate and sanitize the data
  body("title", "Title required").trim().isLength({ min: 1 }).escape(),
  body("text", "Body text required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // if user is not logged in redirect to sign in page
    if (!res.locals.currentUser) {
      res.redirect("/sign-in");
    }

    const errors = validationResult(req);

    // Create Message object with escaped and trimmed data
    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      timestamp: new Date(),
      author: res.locals.currentUser._id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with ssanitized values/error messages
      res.render("pages/postmessage", {
        title: "Create a message",
        errors: errors.array(),
        message,
      });
      return;
    } else {
      // Date from form is valid
      // Upload the message to the database and redirect
      message.save((err) => {
        if (err) {
          return next(err);
        }
        // Message saved. Redirect to main page.
        res.redirect("/");

      })
    }

    console.log(message);
  },
];
