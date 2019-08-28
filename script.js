const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(evt) {
    evt.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru&query=' + searchText;
    movie.innerHTML = 'Loading...';
    requestApi(server)
        .then( result => {
            const output = JSON.parse(result);
            console.log(output);

            let inner = '';

            // output.results.forEach(function (item) {
            for (let item of output.results){
                let itemName = item.name || item.title;
                inner += `<div class="col-12">${itemName}</div>`;
            }

            movie.innerHTML = inner;

        })
        .catch( reason => {
            movie.innerHTML = 'OOPS... Something went wrong...';
            console.log('Error: ' + reason.status);
        });
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {

    return new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.open('GET', url);

        request.onload = () => {
            if (request.status !== 200) {
                reject({
                    status: request.status
                });
                return;
            }

            resolve(request.response);
        };

        request.onerror = () => {
            reject({
                status: request.status
            });
        };

        request.send();

    });

}