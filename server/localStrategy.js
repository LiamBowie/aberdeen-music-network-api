const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');

module.exports = passport => {
    
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

}