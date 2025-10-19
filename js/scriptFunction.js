const getAllMovies = async () => {
    try {
        const response = await fetch(`${API_URL}&s=movie&y=${year}`);
        if (!response.ok) throw new Error('Failed to get movies');

        const data = await response.json();
        console.log('%cКрок 1', 'font-weight: bold;');
        console.log('Список фільмів без деталей:', data.Search);

        const ids = data.Search.map(movie => movie.imdbID);
        const detailsArray = await Promise.all(ids.map(id => getDetails(id)));

        console.log('%cКрок 2 (Всі запити виконуємо паралельно)', 'font-weight: bold;');
        console.log('Список фільмів з деталями:', detailsArray);

        return detailsArray;
    } catch (error) {
        console.error(error);
    }
};

const getDetails = async (id) => {
    try {
        const response = await fetch(`${API_URL}&i=${id}`);
        if (!response.ok) throw new Error('Failed to get details');

        const data = await response.json();

        // console.log('Деталі фільму:', data);

        return data;
    } catch (error) {
        console.error(error);
    }
};

const searchMovies = async () => {
    const word = 'terminator';
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=3ddbca98&s=${word}&type=movie`);
        if (!res.ok) throw new Error('Failed to search movies');

        const data = await res.json();

        console.log('%cКрок 3', 'font-weight: bold;');
        console.log('Результати пошуку за запитом' + '"' + word + '" без деталей:', data.Search);

        const ids = data.Search.map(movie => movie.imdbID);
        const detailsArray = await Promise.all(ids.map(id => getDetails(id)));

        console.log('%cКрок 4 (Всі запити виконуємо паралельно)', 'font-weight: bold;');
        console.log('Результати пошуку за запитом' + '"' + word + '" з деталями:', detailsArray);
        return data;
    } catch (error) {
        console.error(error);
    }
};

getAllMovies();
searchMovies();
