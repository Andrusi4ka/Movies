class Movies {
    constructor() {
        this.year = year;
        this.page = 1;
        this.totalPages = 1;
        this.api = API_URL;

        this.allMovies = document.querySelector('#allMovies');
        this.textResult = document.querySelector('#textResult');
        this.inputSearch = document.querySelector('#inputSearch');
        this.btnLoadMore = document.querySelector('#loadMore');

        this.getAllMovies(this.year, this.page);
        this.setEventListeners();
    }

    setEventListeners() {
        this.inputSearch.addEventListener('input', (event) => {
            const word = event.target.value.trim();
            this.page = 1;
            if (word) {
                this.searchMovies(word, this.page);
            } else {
                this.getAllMovies(this.year, this.page);
            }
        });

        this.btnLoadMore.addEventListener('click', () => {
            if (this.page < this.totalPages) {
                this.page++;
                const word = this.inputSearch.value.trim();
                if (word) {
                    this.searchMovies(word, this.page);
                } else {
                    this.getAllMovies(this.year, this.page);
                }
            }
        });
    }

    async getAllMovies(year, page) {
        try {
            const response = await fetch(`${this.api}&s=movie&y=${year}&page=${page}`);
            if (!response.ok) throw new Error('Failed to get movies');
            const data = await response.json();
            this.renderData(data);
            this.textResult.innerText = `Фільми ${year} року`;
        } catch (error) {
            console.error(error);
        }
    }

    async searchMovies(word, page) {
        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=3ddbca98&s=${word}&type=movie&page=${page}`);
            if (!res.ok) throw new Error('Failed to get movies');

            const data = await res.json();
            this.totalPages = Math.ceil(+data.totalResults / 10);
            this.renderData(data);
            // console.log(data);
            this.textResult.innerText = `${data.totalResults ? 'Знайдено ' + data.totalResults : 'Нічого не знайдено'}`;
        } catch (error) {
            console.error(error);
        }
    }

    renderData(data) {
        if (!data.Search) return;
        const movies = data.Search.map(movie => {
            return `
            <div class="card">
                <a href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank">
                    <img src="${movie.Poster !== "N/A" ? movie.Poster : "../img/no-image.jpg"}"
                         alt="Poster"
                         onerror="this.onerror=null; this.src='../img/no-image.jpg';">
                </a>
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${movie.Title}</h6>
                    <p>Year: ${movie.Year}</p>
                    <p>Type: ${movie.Type}</p>
                </div>
            </div>
            `;
        }).join('');

        this.totalPages = Math.ceil(+data.totalResults / 10);
        if (this.page === 1) {
            this.allMovies.innerHTML = movies;
        } else {
            this.allMovies.innerHTML += movies;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Movies();
});
