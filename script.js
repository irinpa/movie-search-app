const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

// function apiSearch(evt) {
//     evt.preventDefault();
//     const searchText = document.querySelector('.form-control').value;
//     const server = 'https://api.themoviedb.org/3/search/multi?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru&query=' + searchText;
//     requestApi('GET', server);
// }

searchForm.addEventListener('submit', function(evt) {
    evt.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru&query=' + searchText;
    requestApi('GET', server);
});

function requestApi(method, url) {
    
    const request = new XMLHttpRequest();
    request.open(method, url);
    request.send();

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) {
            movie.innerHTML('Loading...');
            return;
        }
        
        if (request.status !== 200) {
            movie.innerHTML('OOPS... Something went wrong...');
            console.log('Error: ' + request.status);
            return;
        }

        const output = JSON.parse(request.response);

        let inner = '';

        output.results.forEach(function(item){
            let itemName = item.name || item.title;
            console.log(itemName);
            inner += `<div class="col-3">${itemName}</div>`;
        });

        movie.innerHTML = inner;
    });
}