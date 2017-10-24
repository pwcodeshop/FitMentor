var express = require("express");
var router  = express.Router({mergeParams: true});
var Listing = require("../models/listing");
var Comment = require("../models/comment");
var middleware = require("../middleware") 

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find listing by id
    Listing.findById(req.params.id, function(err, foundListing){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {listing: foundListing});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup listing using ID
   Listing.findById(req.params.id, function(err, foundListing){
       if(err){
           console.log(err);
           res.redirect("/listings");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               foundListing.comments.push(comment);
               foundListing.save();
               res.redirect('/listings/' + foundListing._id);
           }
        });
       }
   });
});

//EDIT show comment edit form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {listing_id: req.params.id, comment: foundComment});
        }
    });
});

//UPDATE edit comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/listings/" + req.params.id);
        }
    });
});

//DESTROY delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/listings/" + req.params.id);
        }
    });
});


module.exports = router;