module.exports = function(passport) {

var express = require('express');
var router = express.Router();
var Vote = require('../models/vote');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
        res.render('landing', {title: 'The logged in version!'})
    }
    else {
        res.render('landing', {title: 'A Voting App!'})
    }
});

router.get('/failure', function(req, res){
    res.json(req.flash('loginMessage'))
})

router.post('/login', function (req, res, next) {

    passport.authenticate('local-login', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.json(403, {
                message: "no user found"
            });
        }

        // Manually establish the session...
        req.login(user, function(err) {
            if (err) return next(err);
            return res.json({
                message: 'user authenticated',
            });
        });

    })(req, res, next);
});

router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
}))

router.get('/logout', function(req, res){
    console.log('logout')
    req.logout();
    res.redirect('/');
})

router.get('/api/test', function(req, res){
    res.json({message: 'This is only a test'});
})

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        }));
        
router.get('/api/loggedIn', function(req, res){
    res.json(req.user);
})

router.post('/api/new', function(req, res){
    var thing1 = req.body.thing1;
    var thing2 = req.body.thing2;
    var user = req.user;
    
    var newVote = new Vote();
        newVote.thing1 = {thing: thing1, votes: 0};
        newVote.thing2 = {thing: thing2, votes: 0};
        newVote.owner = user;
        newVote.date = new Date();
        newVote.save();
    res.json({message: 'New Vote Created'})
});

router.get('/api/votes', function(req, res){

    Vote.find(function(err, docs){
        res.json(docs)
    })

});


router.post('/api/cast', function(req, res){
    var thing = parseInt(req.body.thing);
    var id = req.body.id;
    
    Vote.findById(id, function(err, vote){
        vote.addVote(thing);
        res.json(vote);
    })

    
});

return router;

}