const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
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
require('./server/passport')(passport);

// Routes
app.post('/login', (req, res) => {
    console.log(req.body)
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const newUser = await db.createUser({username, password});
    if(newUser) {
        res.status(201).json({
            msg: `User (${username}) successfully created!`,
            newUser
        })
    } else { 
        res.status(500).json({
          msg: "Something went wrong"
        });
    }
    console.log(db.records);
});

app.get("/user", (req, res) => {
    console.log(req.body)
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
