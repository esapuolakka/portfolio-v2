import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import YouTube from 'react-youtube'
import debounce from 'lodash.debounce'

import styles from './MovieTheater.module.css'
import MovieCard from './MovieCard'



function MovieTheater() {

  const base_url = 'https://api.themoviedb.org/3'
  const imageUrl = 'https://image.tmdb.org/t/p'
  const api_key = import.meta.env.VITE_MT_API_KEY

  const [movies, setMovies] = useState([])
  const [query, setQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState({})
  const [playTrailer, setPlayTrailer] = useState(false)
  const [isCursorActive, setIsCursorActive] = useState(false)
  const [noTrailer, setNoTrailer] = useState(false)
  const [hasRandomBackdropSet, setHasRandomBackdropSet] = useState(false)


  // Fetching a list of movies
const fetchMovies = useCallback(async () => {
  const type = query ? 'search' : 'discover';
  try {
    const { data } = await axios.get(`${base_url}/${type}/movie`, {
      params: {
        api_key: api_key,
        query: query
      }
    });

    if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
      setMovies(data.results);
      setSelectedMovie(data.results[0])
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}, [query, api_key])


  // Fetching data for a video
  const fetchMovie = async (id) => {
    try {
    const { data } = await axios.get(`${base_url}/movie/${id}`, {
      params: {
        api_key: api_key,
        append_to_response: 'videos'
      }
    })

    if(!data.videos || data.videos.results.length === 0) {
      return {...data, videos: { results: [] }}
    }
    return data
    } catch (error) {
      console.error('Error fetching movie', error)
      return null
    }
  }

  const selectMovie = async (movie) => {
    const data = await fetchMovie(movie.id)
    if(data) {
      setSelectedMovie(data)
      setPlayTrailer(false)
    } else {
      console.log('Failed to fetch movie data')
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [query, fetchMovies])

  // Set the random backdrop during the initial load
  useEffect(() => {
    if (!hasRandomBackdropSet && movies.length > 0) {
      const randomIndex = Math.round(Math.random() * (movies.length - 1))
      setSelectedMovie(movies[randomIndex])
      setHasRandomBackdropSet(true)
      selectMovie(selectedMovie)
    }
  }, [movies, hasRandomBackdropSet])

  // Scrolls screen up when a movie is selected
  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }, [selectedMovie])


  const renderMovies = () =>
    movies.map(movie => (
      <MovieCard
        key={movie.id}
        movie={movie}
        imageUrl={imageUrl}
        selectMovie={selectMovie}
      />
    ))
  
  const selectBackdrop = () => {
    if (!selectedMovie || !selectedMovie.backdrop_path) {
      return null
    }
    return `url(${imageUrl}/original/${selectedMovie.backdrop_path})`;
  }

  const renderTrailer = () => {
    if (!selectedMovie || typeof selectedMovie.videos === 'undefined' || selectedMovie.videos.results.length === 0) {
      setNoTrailer(true)
      return null
    }
    let trailer = selectedMovie.videos.results.find(video => video.name === 'Official Trailer');
  
    // If Official Trailer not found
    if (!trailer) {
      const trailerRegex = /trailer/i;
      trailer = selectedMovie.videos.results.find(video => trailerRegex.test(video.name));
    }
  
    if (trailer) {
      const key = trailer.key;
  
      return (
        <YouTube
          className={styles.video}
          videoId={key}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1
            }
          }}
        />
      )
    } else {
      return <p>No trailer available</p>
    }
  }

  const showPlayTrailerButton = () => {
    if (!playTrailer) {
      return <button className={styles.button} onClick={() => setPlayTrailer(true)}>Play Trailer</button>
    }
    return null;
  }

  const handleMouseMove = () => {
    setIsCursorActive(true)

    setTimeout(() => {
      setIsCursorActive(false)
    }, 3000)
  }

  // Debounce function for movie query
  const debouncedFetchMovies = debounce(fetchMovies, 500)

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    debouncedFetchMovies()

    if (value === '') {
      fetchMovies()
    }
  }

  return (
    <div className={styles.movieTheaterApp}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <a href="/movietheater"><span className={styles.headerTitle}>Movie Theater App</span></a>
          <a href="/" className={styles.backHome}><span>Back to Homepage</span></a>
        </div>
      </header>
      <div className={styles.hero} style={{backgroundImage: selectBackdrop()}} onMouseMove={handleMouseMove}>
        <div className={styles.heroContainer}>
          {selectedMovie.videos && playTrailer ? renderTrailer() : null}
          {isCursorActive && playTrailer ? (<button className={styles.closeButton} onClick={() => setPlayTrailer(false)}>Close</button>) : null}
          {showPlayTrailerButton()}
          <h1 className={styles.heroTitle}>{selectedMovie.title}</h1>
          <p className={styles.heroOverview}>{selectedMovie.overview ? selectedMovie.overview : null}</p>
        </div>
      </div>
        {movies.length === 0 ? <p className={styles.noMovies}>No matching movies</p> :
        <div className={styles.movieContainer}>
          {renderMovies()}
        </div>
        }
      <div className={styles.footer}>
        <input
          className={styles.searchBar}
          type='text'
          placeholder='Search movies...'
          onChange={handleInputChange}
          value={query}
        >
        </input>
      </div>
    </div>
  );
}

export default MovieTheater;