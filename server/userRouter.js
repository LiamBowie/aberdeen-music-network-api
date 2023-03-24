const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const userRouter = express.Router();

/** Configure Passport */

passport.use(new LocalStrategy(
    function(username, password, done){
        db.findByUsername(username, (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false);
        if(user.password != password) return done(null, false);
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

/** Utility functions */ 

const passwordHash = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        console.log(err);
    }
    return null;
}

/** Routes */

userRouter.get("/", (req, res) => {
    res.send(req.user);
});

userRouter.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await passwordHash(password);

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
});

userRouter.get('/login', (req, res, next) => {
    res.status(401).json({ msg: 'Failed to authenticate' });
});

userRouter.post('/login', 
    passport.authenticate('local', { 
        failureRedirect: 'login' 
    }),
    function(req, res) {
        res.status(200).json({msg: 'logged in'});
});

module.exports = userRouter;
