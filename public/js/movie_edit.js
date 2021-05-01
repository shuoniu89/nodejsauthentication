$('form').on('submit', function () {
    let errorMessage = null
    $.each($('input,textarea'), function () {
        if (!$(this).val()) {
            errorMessage = `${$(this).parent().find('label').text()} cannot be empty`;
            return false
        }
    });
    if (errorMessage !== null) {
        $('#error_message').text(errorMessage);
        return false;
    }
});



