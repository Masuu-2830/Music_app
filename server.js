var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    User = require("./models/user.js"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    
mongoose.connect("mongodb+srv://ross:geller@music-u20qo.mongodb.net/test?retryWrites=true&w=majority",  {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

var app = express();
var path = require('path');
var request=require("request");
var paypal = require('paypal-rest-sdk');

app.set('view engine', 'ejs');
app.use(express.static('images'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "FRIENDS is the best ever Sitcom made",
    resave: false,
    saveUninitialized: false
}));
// set public directory to serve static html files 
app.use('/', express.static(path.join(__dirname, 'public'))); 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


  
  

// =======
// ROUTES
// =======

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/songs",isLoggedIn, function(req,res){
	//value enter will come here
request("http://starlord.hackerearth.com/studio",function(error,response,body){
	if(!error && response.statusCode == 200)
		{
			var data = JSON.parse(body);
			res.render("songs",{data:data});
		}
});
});

paypal.configure({
    'mode': 'sandbox', //sandbox or live 
    'client_id': 'AeR2MB-nmo9P9H_j8M43-mkgEMVJmllOQNK7UTHykFKegeN3xMUMZhBV3lJBQaj4CWtn8iJvz__v1FhQ', // please provide your client id here 
    'client_secret': 'EAStG-J4WsJpiP_q0OR12fm_zy20AboQ4JgIntKSiAwvR7gMEgC9K4V_NNLR0rJAXNqXMFEsliPpUU_Q' // provide your client secret here 
  });
  
//Auth Route

//Show sign-up form
app.get("/register", function(req, res) {
    res.render("register");
});
//Handling user signup
app.post("/register", function(req, res) {
//   req.body.username
//   req.body.password
  User.register(new User({username:req.body.username}), req.body.password, function(err, user) {
      if(err) {
          console.log(err);
          return res.render("register");
      }
      passport.authenticate("local")(req, res, function() {
         res.redirect("/songs"); 
      });
  });
});

//LOGIN Routes
//Render login Form
app.get("/login", function(req, res) {
    res.render("login");
});
//Handling user login

app.post("/login", passport.authenticate("local", {
        successRedirect: "/songs",
        failureRedirect: "/login"
    }), function(req, res) {
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//MiddleWare 
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
//payment route
app.get('/buy' , (req , res) => {
    res.redirect('/pay'); 
});
app.get("/pay",function(req, res) {
    res.render("home");
})

// start payment process 
app.get("/bu" , ( req , res ) => {
    // create payment object 
    var amt=Math.random()*150;
    var payment = {
            "intent": "authorize",
	"payer": {
		"payment_method": "paypal"
	},
	"redirect_urls": {
		"return_url": "http://127.0.0.1:3000/success",
		"cancel_url": "http://127.0.0.1:3000/err"
	},
	"transactions": [{
		"amount": {
			"total": 40,
			"currency": "USD"
		},
		"description": " a book on mean stack "
	}]
    }
	
	
	// call the create Pay method 
    createPay( payment ) 
        .then( ( transaction ) => {
            var id = transaction.id; 
            var links = transaction.links;
            var counter = links.length; 
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction 
                    return res.redirect( links[counter].href )
                }
            }
        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.redirect("/err");
        });
}); 


// success page 
app.get("/success" , (req ,res ) => {
    console.log(req.query); 
    res.redirect('/success.html'); 
});

// error page 
app.get("/err" , (req , res) => {
    console.log(req.query); 
    res.redirect('/err.html'); 
})
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}		

app.listen(process.env.PORT, process.env.IP,function(){
	console.log("Hey, I am connected!");
});
