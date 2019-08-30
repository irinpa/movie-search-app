const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w185/';

function apiSearch(evt) {
    evt.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    //trim() убирает все пробелы
    if(searchText.trim().length === 0){
        movie.innerHTML = '<h5 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h5>';
        return;
    }
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru&query=' + searchText;
    movie.innerHTML = '<div class="spinner"></div>';

    fetch(server)
        .then( 
            response => {
                console.log(response.status);
                if (response.status !== 200) {
                    return Promise.reject(new Error('from fetch: ' + response.status));
                }
                return response.json();
            })
        .then(
            result => {
                // console.log(result);
                let inner = '';
                if(result.results.length === 0){
                    inner = '<h5 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h5>';
                }

                for (let item of result.results){
                    console.log(item);
                    let itemName = item.name || item.title;
                    const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.png';
                    
                    let dataInfo = '';

                    if (item.media_type !== 'person'){

                        dataInfo = `data-id="${item.id}"
                        data-type="${item.media_type}"`;
                    }

                    inner += `
                    <div class="col-12 col-md-6 col-xl-3 item">
                    <img src = "${poster}" class = "poster" alt="${itemName}" ${dataInfo}>
                    <h5>${itemName}</h5>
                    </div>
                    `;
                }    
            movie.innerHTML = inner;

            addEventMedia();

            })
        .catch( 
            reason => {
                movie.innerHTML = 'OOPS... Something went wrong...';
                console.log('Error in catch: ' + reason || reason.status);
        });
}    

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
    // зачем data-id?
    const media = movie.querySelectorAll('img[data-id]');

    for (let elem of media){
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    }
}

function showFullInfo(){
    let url = '';
    if(this.dataset.type === 'movie'){
        url = 'кино';
    } else if (this.dataset.type === 'tv'){
        url = 'сериал';
    } else {
        movie.innerHTML = '<h5 class="col-12 text-center text-danger">Произошла ошибка, повторите позже</h5>';
    }
}

document.addEventListener('DOMContentLoaded', function(){
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru')
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

            let inner = '<h5 class="col-12 text-center text-info">Популярное за неделю</h5>';

            if(result.results.length === 0){
                inner = '<h5 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h5>';
            }

            for (let item of result.results){
                // console.log(item);
                let itemName = item.name || item.title;
                let mediaType = item.title ? 'movie' : 'tv';
                const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.png';
                
                let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;

                // if (item.media_type !== 'person'){

                //     dataInfo = `data-id="${item.id}"
                //     data-type="${item.media_type}"`;
                // }

                inner += `
                <div class="col-12 col-md-6 col-xl-3 item">
                <img src = "${poster}" class = "poster" alt="${itemName}" ${dataInfo}>
                <h5>${itemName}</h5>
                </div>
                `;
            }    
        movie.innerHTML = inner;

        addEventMedia();

        })
    .catch( 
        reason => {
            movie.innerHTML = 'OOPS... Something went wrong...';
            console.log('Error in catch: ' + reason || reason.status);
    });
});