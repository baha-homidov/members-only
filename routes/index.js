var express = require("express");
var router = express.Router();

// Require controller modules
const user_controller = require("../controllers/userControllers");
const message_controller = require("../controllers/messageController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Members Only" });
});

// GET sign-in page
router.get("/sign-in", user_controller.sign_in_get);

// POST sign-in page
router.post("/sign-in", user_controller.sign_in_post);

// GET sign-up page
router.get("/sign-up", user_controller.sign_up_get);

// POST sign-up page
router.post("/sign-up", user_controller.sign_up_post);

// GET membership status
router.get("/membership-status", user_controller.membership_status);

// GET post message page
router.get("/post-message", message_controller.message_create_get);

// POST post message page
router.post("/post-message", message_controller.message_create_post);

module.exports = router;
