var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    moment      = require("moment"),
    Listing     = require("./models/listing"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requring routes
var commentRoutes    = require("./routes/comments"),
    listingRoutes = require("./routes/listings"),
    indexRoutes      = require("./routes/index")
    
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://localhost/yclone_portf2");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));//from mo documentation
app.locals.moment= require('moment');

//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "there is probably a safer way to store this key",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user; //req.user comes from passport, has the user info
   next();
});

app.use("/", indexRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The FitMentor Server Has Started!");
});