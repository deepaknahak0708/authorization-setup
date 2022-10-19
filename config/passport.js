// const passport = require('passport')
const LocalStrategy  = require('passport-local').Strategy;
const User = require('../models/userModel');


module.exports = (passport)=>{
    passport.serializeUser((user,done)=>{
        if(user){
           return  done (null, user._id)
        }
        return done(null, false)
    })

    passport.deserializeUser((_id, done)=>{
        User.findById(_id, (err, user)=>{
            if(err) return done (null,false);
            delete user._doc.password
            return done(null, user);
        })
    })

    passport.use(
        "local",
        new LocalStrategy(
            {
                usernameField:"email",
                passReqToCallback: true
            },
             async function(req, username, password, done){
                User.findOne({email:username}, function(err,user){
                    if(err){
                        return done(err)
                    }
                    if(!user){
                        return done(null, false,  {Message: 'username is incorrect'})
                    }
                    return done(null, user)
                })
             }
        )
    )
    
};