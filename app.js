const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const user = require('./router/user.js')
const flash = require('connect-flash')
const path = require('path');

// Initialize Express app
const app = express();

// Set view engine to EJS and static file directory
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())
// Set up express-session middleware
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'harharmahadevharharmahadev'
}));

//set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
const indexRouter = require('./router/index');
app.use('/', indexRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
