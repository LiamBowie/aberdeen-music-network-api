const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const db = require('./db');

userRouter.post('/login', (req, res, next) => {
    console.log('logging in');
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user) res.json({
            msg: "No User Exists"
        });
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.json({
                    msg: "Successfully Authenticated",
                    user
                });
                console.log(req.user);
            });
        }
    })(req, res, next);
});

userRouter.post("/register", async (req, res) => {
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
});

userRouter.get("/", (req, res) => {
    res.send(req.user);
});

module.exports = userRouter;
