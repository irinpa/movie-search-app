const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(evt) {
    evt.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru&query=' + searchText;
    movie.innerHTML = 'Loading...';

    fetch(server)
        .then( 
            response => {
                return response.json();
            })
        .then(
            result => {
                let inner = '';
                for (let item of result.results){
                    let itemName = item.name || item.title;
                    inner += `<div class="col-12 col-md-4 col-xl-3">${itemName}</div>`;
                }
            movie.innerHTML = inner;
            })
        .catch( 
            reason => {
                movie.innerHTML = 'OOPS... Something went wrong...';
                console.log('Error: ' + reason.status);
        });
}    

searchForm.addEventListener('submit', apiSearch);