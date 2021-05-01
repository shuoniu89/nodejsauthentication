function load_movie(movie) {
    $('#title').text(movie.title);
    $('#rating').text(movie.rating);
    $('#release_date').text(movie.release_date);
    $('#overview').text(movie.overview);
    $('#poster_img').attr('src', movie.poster_path);
    if (movie.signups) {
        const names = [];
        movie.signups.forEach(function (user) {
            names.push(user.fullname)
        });
        $('#user_list').text(names.join(', '));
    }
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const movie_id = urlParams.get('movie_id')
console.log(movie_id);

$(document).ready(function () {
    if (movie_id) {
        $.getJSON('/get_movie_by_id?movie_id=' + movie_id)
            .done(function (data) {
                if (data['message'] === "success") {
                    movie = data["data"];
                    load_movie(movie);
                }
            });
    }
});

function onSignUp() {
    $.post('/sign_up', {movie_id: movie_id}).done(function (data) {
        if (data.message === "success") {
            console.log("here");
            location.reload();
        } else {
            location.href = data.data;
        }
    });
}