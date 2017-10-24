//all the middleware goes here
var Listing = require("../models/listing");
var Comment = require("../models/comment");
var User = require("../models/user");
var middlewareObj = {}

//is user logged in and owns the listing
middlewareObj.checkListingOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Listing.findById(req.params.id, function(err, foundListing){
            if(err){
                res.redirect("/listings")
            } else {
                //does user own the listing OR is an admin?
                if(foundListing.author.id.equals(req.user._id) || req.user.isAdmin) { //equals is mongoose method to compare an object to a string
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

//is user logged in and owns the comment
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back")
            } else {
                //does user own the comment OR is an admin?
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) { //equals is mongoose method to compare an object to a string
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

// WIP is user logged in and owns the user profile
// middlewareObj.checkUserOwnership = function(req, res, next) {
//     if(req.isAuthenticated()){
//         User.findById(req.params.user_id, function(err, foundUser) {
//             if(err) {
//                 res.redirect("back");
//             } else {
//                 //does user own the user?
//                 if(foundUser.id.equals(req.user._id)){
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     }
// }

//is user logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;