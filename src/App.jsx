import { useState, useEffect } from 'react'
import './App.css'
import SearchComponent from './Components/SearchComponent'
import MovieCard from './Components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, UpdateSearchedMovie } from './services/AppWork';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}
const API_URL = "https://api.themoviedb.org/3";

const App = () => {
  const [searchText, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState("");

  //here debounce prevent you from requesting too many API requests
  //by waiting for the user to wait abit (500 second);
  useDebounce(() => setDebounceSearchTerm(searchText), 500, [searchText]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("")

    try{
      var endPoint = query ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_URL}/discover/movie?sort_by=popularity.desc`;
      var response = await fetch(endPoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if(data.response === 'false'){
        setErrorMessage(data.error || "Failed to Fetch movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        //console.log(query);
        //console.log(data.results[0]);
        await UpdateSearchedMovie(query, data.results[0]);
      }
    }catch(error){
      console.log(`movie error ${error}`);
      setErrorMessage("Failed to fetch movies from the database, try again!!");
    }finally{
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies();
      if(movies.length > 0) setTrendingMovies(movies);
      else setTrendingMovies("No Trending Movies.")
    }catch(error){
      console.log(`error occurred while fetching trending movies ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <h1>Find <span className="text-gadient">Movies</span> Yo'll enjoy watching</h1>
          <SearchComponent searchText={searchText} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="">All Movies</h2>
          {isLoading ? (<p className="text-white">Loading....</p>) : errorMessage ? (<p className="text-red-500">{errorMessage}</p>) : (
            <div className="movies-grid">
              {movieList.map((movie) => (<MovieCard key={movie.id} movie={movie} />))}
            </div>
          ) }
        </section>


      </div>
    </main>
  )
}

export default App
