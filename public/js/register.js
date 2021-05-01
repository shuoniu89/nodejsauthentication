const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get("error")) {
    console.log(urlParams.get("error"));
    alert(urlParams.get("error"));
}