const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w185/';
const emptyPosterUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

function apiSearch(evt) {
    evt.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru&query=' + searchText;
    movie.innerHTML = 'Loading...';

    fetch(server)
        .then( 
            response => {
                console.log('response.status:' +response.status);
                if (response.status !== 200) {
                    return Promise.reject(new Error('from fetch: ' + response.status));
                }
                return response.json();
            })
        .then(
            result => {
                console.log(result);
                let inner = '';
                for (let item of result.results){
                    let itemName = item.name || item.title;
                    if (item.poster_path) {
                        inner += `
                        <div class="col-12 col-md-4 col-xl-3 item">
                        <img src = "${urlPoster + item.poster_path}" alt="${itemName}">
                        <h5>${itemName}</h5>
                        </div>`;
                    } else {
                        inner += `
                        <div class="col-12 col-md-4 col-xl-3 item">
                        <img src = "${emptyPosterUrl}" alt="${itemName}">
                        <h5>${itemName}</h5>
                        </div>`;
                    }
                     
                    
                }
            movie.innerHTML = inner;
            })
        .catch( 
            reason => {
                movie.innerHTML = 'OOPS... Something went wrong...';
                console.log('Error in catch: ' + reason);
        });
}    

searchForm.addEventListener('submit', apiSearch);