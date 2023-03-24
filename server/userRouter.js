const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const userRouter = express.Router();

/** Configure Passport */

passport.use(new LocalStrategy(
    function(username, password, done){
        db.findByUsername(username, async (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false);

        const match = await bcrypt.compare(password, user.password);
        if(!match) return done(null, false);
        return done(null, user);
        });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.findById(id, function (err, user) {
        if (err) return done(err); 
        done(null, user);
    });
});

/** Routes */

userRouter.get("/", (req, res) => {
    res.send(req.user);
});

userRouter.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10) 
    const newUser = await db.createUser({username, password: hash})

    if(newUser) {
        res.status(201).json({
            msg: `User (${username}) successfully created!`,
            newUser
        })
        console.log(db.getRecords());
    } else { 
        res.status(500).json({
            msg: "Something went wrong"
        });
    }
});

userRouter.post('/login', 
passport.authenticate('local', { failureRedirect: 'login' 
}),
(req, res) => {
    res.status(200).json({msg: 'logged in'});
});

userRouter.get('/login', (req, res, next) => {
    res.status(401).json({ msg: 'Failed to authenticate' });
});

module.exports = userRouter;
