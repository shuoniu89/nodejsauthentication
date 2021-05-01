require('dotenv').config()
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//Add sessions
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//Configure body-parser and set static dir path.
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//Initialize passport
console.log(process.env.SESSION_SECRET)


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost:27017/movieDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);


const movieSchema = {
    title: String,
    rating: Number,
    poster_path: String,
    release_date: String,
    overview: String,
    signups: [{
        username: String,
        fullname: String
    }]
};

const Movie = mongoose.model('Movie', movieSchema);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        require: true,
        minlength: 3
    },
    password: {
        type: String,
        require: true
    },
    fullname: {
        type: String,
        require: true
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

//Configure passport
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/', function (req, res) {
    // res.sendFile(__dirname + "/public/index.html")
    if (req.isAuthenticated()) {
        res.redirect(`/movie_list.html?fullname=${req.user.fullname}`);
    } else {
        res.redirect("/movie_list.html");
    }
});

app.get("/get_all_movies", function (req, res) {
    Movie.find(function (err, data) {
        if (err) {
            res.send({
                "message": "error",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    });
});

app.get('/get_movie_by_id', function (req, res) {
    Movie.findOne({"_id": req.query.movie_id}, function (err, data) {
        if (err) {
            res.send({
                "message": "error",
                "data": {}
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    });
});


app.get('/register', (req, res) => {
    res.redirect("/register.html");
});

app.post('/register', (req, res, next) => {
    console.log("register route");
    const newUser = {username: req.body.username, fullname: req.body.fullname};
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            const authenticate = passport.authenticate("local");
            authenticate(req, res, function () {
                res.redirect("/");
            });
        }
    });
});


app.get('/login', (req, res) => {
    if (req.query.error) {
        res.redirect("/login.html?error=" + req.query.error);
    } else {
        console.log("redirect");
        res.redirect("/login.html");
    }
});

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        passport: req.body.password
    })
    req.login(user, function (err) {
        if (err) {
            console.log(err)
            res.redirect('/login.html?error=Invalid user name or password')
        } else {
            const authenticate = passport.authenticate("local", {
                successRedirect: "/",
                failureRedirect: "/login?error=Invalid user name or password"
            });
            authenticate(req, res);
        }
    });
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/")
})

app.get("/edit", (req, res) => {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/auth/movie_edit.html");
    } else {
        res.redirect("/login");
    }
});


app.post('/sign_up', (req, res) => {
    if (req.isAuthenticated()) {
        const movie_id = req.body.movie_id;
        Movie.updateOne(
            {_id: movie_id},
            {
                $addToSet: {
                    signups: [{
                        username: req.user.username,
                        fullname: req.user.fullname
                    }]
                }
            },
            {},
            function (err, info) {
                if (err) {
                    res.send({
                        message: "database error",
                        data: {}
                    })
                } else {
                    res.send({
                        message: "success",
                        data: {}
                    })
                }
            })
    } else {
        console.log("no auth")
        res.send({
            message: "login required",
            data: "/login"
        });
    }
});