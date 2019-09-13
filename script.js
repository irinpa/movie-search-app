const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500/';

function apiSearch(evt) {
    evt.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    //trim() убирает все пробелы
    if(searchText.trim().length === 0){
        movie.innerHTML = '<h5 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h5>';
        return;
    }
    // const server = 'https://api.themoviedb.org/3/search/multi?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru&query=' + searchText;
    movie.innerHTML = '<div class="spinner"></div>';

    fetch('https://api.themoviedb.org/3/search/multi?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru&query=' + searchText)
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
                    // console.log(item);
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
        url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru';
    } else if (this.dataset.type === 'tv'){
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru';
    } else {
        movie.innerHTML = '<h5 class="col-12 text-center text-danger">Произошла ошибка, повторите позже</h5>';
    }

    fetch(url)
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
                console.log(result);

                let statusOutput = '';

                if (result.status == 'Released') {
                    statusOutput = 'В прокате';
                } else if (result.status == 'Ended') {
                    statusOutput = 'Прокат завершён';
                } else {
                    statusOutput = 'Неизвестен';
                }

                movie.innerHTML = `
                    
                    <div class="col-4">
                        <img src='${urlPoster + result.poster_path}' alt='${result.name || result.title}'>
                        ${(result.homepage) ? `<p class='text-center'> <a href="${result.homepage}" target="_blank"> Официальная страница</a></p>` : ''}
                        ${(result.imdb_id) ? `<p class='text-center'> <a href="https://imdb.com/title/${result.imdb_id}" target="_blank"> Страница на IMDB.com</a></p>` : ''}
                    </div>
                    <div class="col-8">
                        <h4 class="text-info">${result.name || result.title}</h4>
                        <p> Рейтинг: ${result.vote_average}</p>
                        <p> Статус: ${statusOutput} </p>
                        <p> Премьера: ${result.first_air_date || result.release_date}</p>

                        ${(result.last_episode_to_air) ? `<p>${result.number_of_seasons} сезонов вышло. В последнем сезоне -  ${result.last_episode_to_air.episode_number} серий.  </p> ` : ''}

                        <p> Описание: ${result.overview} </p>

                        <br>

                        <div class="youtube"></div>


                    </div>`;
                    getVideo(this.dataset.type, this.dataset.id);
            }
        )

                

        .catch( 
            reason => {
                movie.innerHTML = 'Упс! Что-то пошло не так :(';
                console.log('Error in catch: ' + reason || reason.status);
        });
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
    
                    inner += `<div class="col-12 col-md-6 col-xl-3 item">
                    <img src = "${poster}" class = "poster" alt="${itemName}" ${dataInfo}>
                    <h5>${itemName}</h5>
                    </div>`;
                }    

                movie.innerHTML = inner;
    
                addEventMedia();
            }
        )

        .catch( 
            reason => {
                movie.innerHTML = 'Упс! Что-то пошло не так :(';
                console.log('Error in catch: ' + reason || reason.status);
        });
});    

function getVideo(type, id) {
    let youtube = movie.querySelector('.youtube');

    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=618653b3a45b6be44c46f38f077a1d0b&language=ru`)
        .then( 
            response => {
                if (response.status !== 200) {
                    return Promise.reject(new Error('from fetch: ' + response.status));
                }
                return response.json();
        })
        .then(
            result => {
                console.log(result);
                let videoFrame = '<h5 class="text-info">Трейлеры</h5>';

                if (result.results.length === 0){
                    videoFrame = '<p>Трейлеры отсутствуют</p>';
                }
                
                for (let item of result.results){
                    videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    
                }
                youtube.innerHTML = videoFrame;
            }
        )
        .catch(
            reason => {
                youtube.innerHTML = 'Трейлера не существует';
                console.error('Error in catch: ' + reason || reason.status);
            }
        );


    youtube.innerHTML = id;
}