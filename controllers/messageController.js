const Message = require("../models/message");

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
exports.message_create_post = [(req, res) => {
  res.send("NOT IMPLEMENTED: Message create POST");
};]
