var express = require("express");
var router  = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware")

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User(
        {
            username: req.body.username,
            fullName: req.body.fullName,
            avatar: req.body.avatar,
            aboutMe: req.body.aboutMe
        });
    //admin role piece
    if(req.body.adminCode === 'secretCode123') { //set this to something strong
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/listings"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/listings",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/listings");
});

// User show profile route
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if(err) {
            console.log(err);
            res.redirect("/listings");
        } else {
            res.render("users/show", {user: foundUser});
        }
    });
});

// User edit profile route
router.get("/users/:id/edit", middleware.isLoggedIn, function(req, res) { //should finish new middleware to confirm ownership of user
    User.findById(req.params.id, function(err, foundUser){
        res.render("users/edit", {user: foundUser});
    });
});

// User update profile route
router.put("/users/:id", middleware.isLoggedIn, function(req, res){
    //find and update the user
    User.findByIdAndUpdate(req.params.id, req.body.userObj, function(err, updatedUser){ //should finish new middleware to confirm ownership of user
        if(err){
            res.redirect("/users/:id");
        } else {
            res.redirect("/users/" + updatedUser._id);
        }
    });
});

module.exports = router;