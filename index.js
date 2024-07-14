
const imgPath = "http://image.tmdb.org/t/p/original/";
const apikey = "181e4e280295abd78d25e3639d5f3b53";
const apiEndPoint = "https://api.themoviedb.org/3";
const youTubeApi = "AIzaSyD2jWhSfLRzfWV648ywmhEwyLAYitnSyjs";
const apiPath = {
    fetchAllCatagories: `${apiEndPoint}/genre/movie/list?api_key=${apikey}&append_to_response=videos,images#`,
    fetchMovieList : (id)=> `${apiEndPoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending : `${apiEndPoint}/trending/all/day?api_key=${apikey}&language=en-us`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youTubeApi}`
}
function init(){
    fetchTrendingMovies();
    fetchAndBulitAllSetcions();
}
function fetchTrendingMovies(){
    fetchAndBuildMovieSection(apiPath.fetchTrending, 'Trending Now')
    .then(list => {
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex]);
    }).catch(err=>{
        console.error(err);
    });
}
function buildBannerSection(movie){
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
    const div = document.createElement('div');
    div.innerHTML = `
        <h2 class="banner_title">${movie.title}</h2>
        <p class="banner_info">Trending in movies Released ${movie.release_date}</p>
        <P class="banner_overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</P>
        <div class="action-button-cont">
            <button class="action-button "><i class="fa fa-play"></i>Play</button>
            <button class="action-button "><i class="fa fa-info-circle" ></i>Move Info</button>
        </div>
    `;
    div.className = 'banner-content container';
    bannerCont.append(div);
}





function fetchAndBulitAllSetcions(){
    fetch(apiPath.fetchAllCatagories)
    .then(res=>res.json())
    .then(res=>{
        const catagories = res.genres;
        if(Array.isArray(catagories) && catagories.length > 0){
            catagories.forEach(catagory => {
                fetchAndBuildMovieSection(
                    apiPath.fetchMovieList(catagory.id),
                    catagory.name
                );
            })
           
        }
        // console.table(movies);

    })
    .catch(error=>console.log(error))
}
function fetchAndBuildMovieSection(fetchUrl,catagoryName){
    // console.log(fetchUrl,catagory);
    // let m;
    return fetch(fetchUrl)
    .then(res=>res.json())
    .then(res=>{
        // console.table(res.results);
        const movies = res.results;
        if(Array.isArray(movies) && movies.length>0){
            buildMovieSection(movies.slice(0,8),catagoryName);
            return movies;
        }
        // console.log(movies);
        
        // m = movies;
    })
    .catch(error=>console.log(error))
    // return m;
}
function  buildMovieSection(list , catagoryName){
    // console.log(list,catagoryName);
    const moviesCont = document.getElementById('movies-cont');
    const moviesListHTMl = list.map(item => {
        return  `
        <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
            <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
            <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    }).join('');
    const moviesSectionsHTML = `
        <h2 class="movies-section-heading">${catagoryName} <span class="explore-nudge">Explore All</span></h2>
        <div class="movies-row">
            ${moviesListHTMl}
        </div>
    `;
    // console.log(moviesSectionsHTML);

    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = moviesSectionsHTML;
    moviesCont.append(div);
}

function searchMovieTrailer(movieName, iframId) {
    if (!movieName) return;

    fetch(apiPath.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        const bestResult = res.items[0];
        
        const elements = document.getElementById(iframId);
        console.log(elements, iframId);

        const div = document.createElement('div');
        div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`

        elements.append(div);
        
    })
    .catch(err=>console.log(err));
}

addEventListener('load',function(){
    init();
    window.addEventListener('scroll', function(){
        //header ui update
        const header = document.getElementById('header');
        if(this.window.scrollY > 5){
            header.classList.add('black_background');
        }
        else{
            header.classList.remove('black_background');
        }
    })
})