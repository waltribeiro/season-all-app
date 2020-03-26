const LocalStrategy = require('passport-local').Strategy;

const db  = require('../models');

var regex = new RegExp("^[a-z][A-Z][0-9]{8}$");

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.uuid);
    });

    passport.deserializeUser(function(uuid, done) {
        db.Accounts.findByPk(uuid).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField : 'account_key',
        passReqToCallback : true
    },
    function(req, email, account_key, done) {
        process.nextTick(function() {
        db.Accounts.findOne({
            where: {email: email}
        }).then(function(user, err){
            if(err) {
                console.log("err",err)
                return done(err);
            } 
            if(password) {
                console.log("err",err)
                return done(err);
            } 
            if (user) {
                console.log('signupMessage', 'That email is already taken.');
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                db.Accounts.create({
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    street: req.body.street,
                    city: req.body.city,
                    state: req.body.state,
                    zip: req.body.zip,
                    email: req.body.email,
                    phone: req.body.phone,
                    account_key: db.Accounts.generateHash(account_key) 
				}).then(function(dbUser) {		    	
                    return done(null, dbUser);
                }).catch(function (err) { console.log(err);}); 
            }
        });   
    });
}));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField : 'account_key',
    passReqToCallback : true 
},
function(req, email, account_key, done) { 
    db.Accounts.findOne({
        where: {
            email: req.body.email 
        }
    }).then(function(user, err) {
        if (!user){
            console.log("no user found");
            return done(null, false, req.flash('loginMessage', 'No user found.')); 
        }
        if (user && !user.validPassword(req.body.account_key)){
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
        }
        return done(null, user);
    });
}));

};