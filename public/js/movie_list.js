function showList(movies) {
    $('#movie_list').empty();

    for (let i = 0; i < movies.length; i++) {
        $('#movie_list').append("<li class='list-group-item'></li>");
    }

    $('#movie_list li')
        .attr("value", function (idx) {
            return movies[idx]._id;
        })
        .append("<div class='row'></div>");

    $('#movie_list .row').addClass(function (idx) {
        if (idx % 2 === 0) {
            return 'even_row';
        } else {
            return 'odd_row';
        }
    });

    $('#movie_list .row')
        .append("<div class='col-lg-2 imgDiv'></div>")
        .append("<div class='col-lg-6 infoDiv'></div>")

    $('.imgDiv').append("<img class='movie_poster'/>");
    $('.movie_poster').attr('src', function (idx) {
        return movies[idx].poster_path;
    });

    $('.infoDiv')
        .append(function (idx) {
            return `<a class="movie_title">${movies[idx].title}</a>`;
        })
        .append(idx => {
            return `<p class="rating">Rating: ${movies[idx].rating}</p>`
        });

    $('.rating').addClass('larger_text cel_noto');


    $('.movie_title').on('click', function () {
        const movieId = $(this).parents("li").attr('value');
        location.href = "movie_detail.html?movie_id=" + movieId;
    });
}

$.getJSON("/get_all_movies")
    .done(function (data) {
        if (data.message === "success") {
            showList(data.data);
        }
    });

function onCreate() {
    location.href = "/edit";
}

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('fullname')) {
    $('.login').remove();
    $('#showname').text(urlParams.get('fullname'));
} else {
    $('.logout').remove();
}