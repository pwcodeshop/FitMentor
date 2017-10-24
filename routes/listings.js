var express = require("express");
var router  = express.Router();
var Listing = require("../models/listing");
var middleware = require("../middleware") //no need to specify index.js because for express it's a special name and will look for index.js automatically

//INDEX - show all listings
router.get("/", function(req, res){
    // Get all listings from DB
    Listing.find({}, function(err, allListings){
        if(err){
            console.log(err);
        } else {
            res.render("listings/index",{listings:allListings});
        }
    });
});

//CREATE - add new listing to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to listings array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = { //create the author object so can be saved within listing object
        id: req.user._id,
        username: req.user.username
    };
    var newListing = {name: name, price: price, image: image, description: desc, author: author}
    // Create a new listing and save to DB
    Listing.create(newListing, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to index page
            res.redirect("/listings");
        }
    });
});

//NEW - show form to create new lii=sting
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("listings/new"); 
});

// SHOW - shows more info about one listing
router.get("/:id", function(req, res){
    //find the listing with provided ID
    Listing.findById(req.params.id).populate("comments").exec(function(err, foundListing){
        if(err){
            console.log(err);
        } else {
            console.log(foundListing)
            //render show template with that listing
            res.render("listings/show", {listing: foundListing});
        }
    });
});

//EDIT - access the edit form
router.get("/:id/edit", middleware.checkListingOwnership, function(req, res) {
    //if middleware passes then the next thing is to find the listing by id and render the edit page
    Listing.findById(req.params.id, function(err, foundListing){
        res.render("listings/edit", {listing: foundListing});
    });
});

//UPDATE - edit an existing listing
router.put("/:id", middleware.checkListingOwnership,function(req, res) { //add isLoggedIn?
    //find and update the correct listing
    Listing.findByIdAndUpdate(req.params.id, req.body.listingObj, function(err, updatedListing){ //using listingObj from edit.ejs
        if(err){
            res.redirect("/listings");
        } else {
            res.redirect("/listings/" + updatedListing._id);
        }
    });
});

//DESTROY
router.delete("/:id", middleware.checkListingOwnership, function(req, res) { //add isLoggedIn?
    Listing.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/listings");
        } else {
            res.redirect("/listings");
        }
    })
});

module.exports = router;

