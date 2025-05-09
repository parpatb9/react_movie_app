import React from 'react'
import Search from './components/Search'
import { useEffect } from 'react';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce} from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY= import.meta.env.VITE_TMBD_API_KEY;
const API_OPTIONS = {
  method : 'GET',
  headers : {
    accept : 'application/json',
    Authorization : `Bearer ${API_KEY}`
  }
}


const App = () => {

  const [searchTerm, setSearchTerm] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [movieList, setMovieList] = React.useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');
  const [trendingMovies, setTrendingMovies] = React.useState([]);

  // Debounce the search term to prevent too many API calls
  // useDebounce is a custom hook that delays the update of the search term
  // to the state until after a specified delay (500ms in this case)
  useDebounce(()=>setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  // useEffect to fetch movies when the debounced search term changes

  const fetchTrendingMovies = async () => {
    try {
     
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);
        

      
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      
      
    }
  }

  const fetchMovies = async (query = '') =>{
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMovieList(data.results || []);

    if(query && data.results.length > 0){
     
      await updateSearchCount(query, data.results[0]);
    }
   
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');

      
    } finally {
      setIsLoading(false);
    }
  }
   useEffect(() => {
    fetchMovies(debouncedSearchTerm);

   },[debouncedSearchTerm]);

   useEffect(() => {
    fetchTrendingMovies();
   },[]);


  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy without the Hassel
          </h1>
        
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>
              Trending Movies
            </h2>
            <ul>
              {trendingMovies.map((movie,index) =>(
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>

              
              ))}
            </ul>

          </section>
        )}

        <section className="all-movies">
          <h2 >
            All Movies
          </h2>
         {isLoading ? (
          <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ):(

          <ul>
            {movieList.map((movie) =>(
             <MovieCard key={movie.id} movie={movie}/>

            ))}
          </ul>

         )}
        </section>
      </div>
    </main>
  )
}

export default App
