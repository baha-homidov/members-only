const User = require("../models/user"); // User mongoose model to interact with MongoDB
const { body, check, validationResult } = require("express-validator"); // validator library for serverside validation
const bcrypt = require("bcryptjs"); // library for hashing and salting (encrypting and decrypting) the passwords
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

// Define and use a LocalStrategy for authentication
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      // use bcrypt.compare to compare the received password with the encrypted password in the database
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Display sign-in form on GET
exports.sign_in_get = (req, res) => {

  res.render("pages/signin", {
    title: "Sign in",
    errorMessage:
      req.session.messages != undefined ? req.session.messages : null,
  });
};

// Handle sign-in form on POST
exports.sign_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/sign-in",
  failureMessage: true,
});

// app.post(
//   "/log-in",

// );

// Display sign-up form on GET
exports.sign_up_get = (req, res) => {
  res.render("pages/signup", { title: "Sign up" });
};

// Handle sign-up on POST
exports.sign_up_post = [
  // Validate and sanitize the data
  body("username", "Username required").trim().isLength({ min: 1 }).escape(),
  body("fullname", "Fullname required").trim().isLength({ min: 1 }).escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Passwords should be at least 6 character long"),
  body("confirm-password", "Confirm password required required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Check if confirm-passwords matches the password
  check("confirm-password", "Passwords do not match").custom(
    (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }
  ),
  // Process request after validation and sanitization.
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      // if err, do something
      if (err) {
        next(err);
        return;
      }

      // otherwise, store the user with hashedPassword in DB
      const errors = validationResult(req);

      // Create User object with escaped and trimmed data
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        fullname: req.body.fullname,
        membership: "non-member",
      });

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.

        res.render("pages/signup", {
          title: "Sign up",
          errors: errors.array(),
          user,
        });
        return;
      } else {
        // Data from form is valid.
        // Check if User with same name already exists.
        User.findOne({ username: req.body.username }).exec(
          (err, found_user) => {
            if (err) {
              return next(err);
            }

            if (found_user) {
              // User exists, re-render with an error

              // get JS array from errors object
              const errorsArray = errors.array();

              // add a custom error for duplicate username
              errorsArray.push({
                msg: "Username already exists",
                param: "duplicate_username",
              });
              res.render("pages/signup", {
                title: "Sign up",
                errors: errorsArray,
                user,
              });
              
            } else {
              user.save((err) => {
                if (err) {
                  return next(err);
                }
                // User saved. Redirect to main page.
                res.redirect("/");
              });
            }
          }
        );
      }
    });
  },
];

// Display membership status on GET
exports.membership_status = (req, res) => {
  res.send("NOT IMPLEMENTED: Memebership status on GET");
};
