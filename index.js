const express = require('express');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const db = require('./server/db');
const apiRouter = require('./server/api');
const PORT = process.env.PORT || 4001;
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // <-- location of the host site we're connecting to
    credentials: true
}));

app.use(
    session({
      secret: "f4z4gslG6g", // This will eventually be stored as an ENV variable
      cookie: { maxAge: 172800000, secure: false },
      saveUninitialized: false,
      resave: false,
    })
  );

app.use(morgan('short'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', apiRouter)

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(db.getRecords());
});
