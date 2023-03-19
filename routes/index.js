var express = require("express");
var router = express.Router();

// Require controller modules
const user_controller = require("../controllers/userControllers");
const message_controller = require("../controllers/messageController");

/* GET home page. */
router.get("/", message_controller.index);

// GET sign-in page
router.get("/sign-in", user_controller.sign_in_get);

// POST sign-in page
router.post("/sign-in", user_controller.sign_in_post);

// GET sign-up page
router.get("/sign-up", user_controller.sign_up_get);

// POST sign-up page
router.post("/sign-up", user_controller.sign_up_post);

// GET log-out page
router.get("/log-out", user_controller.logout);

// GET membership status
router.get("/membership-status", user_controller.membership_status_get);

// POST membership status
router.post("/membership-status", user_controller.membership_status_post);

// GET post message page
router.get("/post-message", message_controller.message_create_get);

// POST post message page
router.post("/post-message", message_controller.message_create_post);

// GET delete message 
router.get("/delete/:id", message_controller.delete);



module.exports = router;
