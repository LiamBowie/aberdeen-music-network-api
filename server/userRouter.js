const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('./db');
const userRouter = express.Router();

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

    const newUser = await db.createUser({username, hashedPassword});
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

userRouter.post('/login', (req, res, next) => {
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

module.exports = userRouter;
