const Message = require("../models/message");
const { body, check, validationResult } = require("express-validator"); // validator library for serverside validation
const user = require("../models/user");

// Retrieve all messages from backend and dispaly them
exports.index = (req, res, next) => {
  // Retrieve all the messages from the database
  Message.find({})
    .sort({ timestamp: -1 })
    .populate("author", "username")
    .exec(function (err, list_messages) {
      if (err) {
        return next(err);
      }

      // Strip out the user names if user is not signed in or has a "non-member status"
      if (
        !res.locals.currentUser ||
        (res.locals.currentUser &&
          res.locals.currentUser.membership === "non-member")
      ) {
        list_messages.forEach((element, index) => {
          list_messages[index].author.username = "hidden";
        });
      }

      // Successful, so render
      res.render("pages/index", {
        title: "Members Only",
        message_list: list_messages,
      });
    });
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
      });
    }

    console.log(message);
  },
];

module.exports.delete = (req, res, next) => {
  // if user is not logged in or doesn't have admin permissions redirect to index page
  if (
    !res.locals.currentUser ||
    (res.locals.currentUser && res.locals.currentUser.membership !== "admin")
  ) {
    res.redirect("/");
    return;
  }

  // User has admin permissions, delete the message
  Message.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      next(err);
    }

    // Success go to main page
    res.redirect("/");
  });
};
