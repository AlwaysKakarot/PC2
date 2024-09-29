document.addEventListener('DOMContentLoaded', () => {
    const movieGallery = document.querySelector('.movie-gallery');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.close-btn');
    const genreSelect = document.getElementById('genre-select'); 
    
    const API_KEY = '2e5e8665e9dfe0c9f5c4152fdcd5af25'; 
    const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
    const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-ES`;
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    
    let allMovies = []; 

    
    async function getGenresFromTMDB() {
        try {
            const response = await fetch(GENRE_URL);
            const data = await response.json();
            populateGenreSelect(data.genres); 
        } catch (error) {
            console.error('Error fetching genres from TMDB:', error);
        }
    }

    function populateGenreSelect(genres) {
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });
    }

    async function getMoviesFromTMDB() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            allMovies = data.results; 
            renderMovies(allMovies); 
        } catch (error) {
            console.error('Error fetching movies from TMDB:', error);
        }
    }

    function renderMovies(movies) {
        movieGallery.innerHTML = '';
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.classList.add('movie-card');
            card.innerHTML = `
                <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.overview}</p>
                <button class="favorite-btn">Favorite</button>
            `;
            movieGallery.appendChild(card);

            const favoriteBtn = card.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', () => {
                favoriteBtn.classList.toggle('favorited');
                openModal(movie);
            });
        });
    }

    function filterMoviesByGenre(genreId) {
        const filteredMovies = genreId === "all"
            ? allMovies
            : allMovies.filter(movie => movie.genre_ids.includes(parseInt(genreId)));
        renderMovies(filteredMovies);
    }

    function openModal(movie) {
        modalTitle.textContent = movie.title;
        modalImage.src = IMAGE_BASE_URL + movie.poster_path;
        modalDescription.textContent = movie.overview;
        modal.style.display = 'block';
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    genreSelect.addEventListener('change', (event) => {
        filterMoviesByGenre(event.target.value);
    });

    getGenresFromTMDB();
    getMoviesFromTMDB();
});
