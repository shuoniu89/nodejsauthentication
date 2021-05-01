const mongoose = require('mongoose');

const fs = require('fs');
const rawdata = fs.readFileSync(__dirname + "/data.json");
jsonList = JSON.parse(rawdata);

mongoose.connect('mongodb://localhost:27017/movieDB', {useNewUrlParser: true}, function () {
    console.log("db connected successful!")
});

const movieSchema = new mongoose.Schema({
    title: String,
    rating: Number,
    poster_path: String,
    release_date: String,
    overview: String,
})

const Movie = mongoose.model('Movie', movieSchema);

movieList = []

jsonList.forEach(function (movie) {
    movieList.push({
        "title": movie["title"],
        "rating": movie["vote_average"],
        "poster_path": 'http://image.tmdb.org/t/p/w342' + movie["poster_path"],
        "release_date": movie["release_date"],
        "overview": movie["overview"]
    })
});

Movie.insertMany(movieList, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("All data saved");
        mongoose.connection.close();
    }
});