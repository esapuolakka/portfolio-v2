import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import debounce from "lodash.debounce";

import "./MovieTheater.css";
const MovieCard = React.lazy(() => import("./MovieCard.jsx"));

function MovieTheater() {
  const base_url = "https://api.themoviedb.org/3";
  const imageUrl = "https://image.tmdb.org/t/p";
  const api_key = import.meta.env.VITE_MDB_API_KEY;

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState({});
  const [playTrailer, setPlayTrailer] = useState(false);
  const [isCursorActive, setIsCursorActive] = useState(false);
  const [movieCache, setMovieCache] = useState({});

  // Fetching a list of movies
  const fetchMovies = useCallback(async () => {
    if (movieCache[query]) {
      setMovies(movieCache[query]);
      setSelectedMovie(movieCache[query][0]);
      return;
    }
    const type = query ? "search" : "discover";
    try {
      const { data } = await axios.get(`${base_url}/${type}/movie`, {
        params: {
          api_key: api_key,
          query: query,
        },
      });

      if (data?.results?.length) {
        setMovies(data.results);
        setSelectedMovie(data.results[0]);
        setMovieCache((prevCache) => ({
          ...prevCache,
          [query]: data.results,
        }));
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, [query, api_key, movieCache]);

  // Fetching data for a video
  const fetchMovie = async (id) => {
    try {
      const { data } = await axios.get(`${base_url}/movie/${id}`, {
        params: {
          api_key: api_key,
          append_to_response: "videos",
        },
      });

      if (!data.videos || data.videos.results.length === 0) {
        return { ...data, videos: { results: [] } };
      }
      return data;
    } catch (error) {
      console.error("Error fetching movie", error);
      return null;
    }
  };

  const selectMovie = async (movie) => {
    const data = await fetchMovie(movie.id);
    if (data) {
      setSelectedMovie(data);
      setPlayTrailer(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      console.log("Failed to fetch movie data");
    }
  };

  useEffect(() => {
    if (!query) fetchMovies();
  }, [query, fetchMovies]);

  // Set the random backdrop during the initial load
  useEffect(() => {
    if (selectedMovie?.backdrop_path) {
      const img = new Image();
      img.src = `${imageUrl}/original/${selectedMovie.backdrop_path}`;
    }
  }, [selectedMovie]);

  const renderMovies = () =>
    movies.map((movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        imageUrl={imageUrl}
        selectMovie={selectMovie}
      />
    ));

  const selectBackdrop = () => {
    if (!selectedMovie || !selectedMovie.backdrop_path) {
      return null;
    }
    return `url(${imageUrl}/original/${selectedMovie.backdrop_path})`;
  };

  let trailer = useMemo(() => {
    if (!selectedMovie?.videos?.results) return null;
    return (
      selectedMovie.videos.results.find(
        (video) => video.name === "Official Trailer"
      ) ||
      selectedMovie.videos.results.find((video) => /trailer/i.test(video.name))
    );
  }, [selectedMovie]);

  const renderTrailer = () => {
    if (
      !selectedMovie ||
      typeof selectedMovie.videos === "undefined" ||
      selectedMovie.videos.results.length === 0
    ) {
      return null;
    }

    // If Official Trailer not found
    if (!trailer) {
      const trailerRegex = /trailer/i;
      trailer = selectedMovie.videos.results.find((video) =>
        trailerRegex.test(video.name)
      );
    }

    if (trailer) {
      const key = trailer.key;

      return (
        <YouTube
          className="movie_video"
          videoId={key}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
            },
          }}
        />
      );
    } else {
      return <p>No trailer available</p>;
    }
  };

  const showPlayTrailerButton = () => {
    if (!playTrailer) {
      if (movies.length !== 0) {
        return (
          <button className="movie_button" onClick={() => setPlayTrailer(true)}>
            Play Trailer
          </button>
        );
      }
    }
    return null;
  };

  const handleMouseMove = () => {
    setIsCursorActive(true);

    setTimeout(() => {
      setIsCursorActive(false);
    }, 3000);
  };

  // Debounce function for movie query
  const debouncedFetchMovies = debounce(fetchMovies, 500);

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setQuery(value);

    if (value) {
      debouncedFetchMovies();
    }
    fetchMovies();
  };

  return (
    <div className="movieTheaterApp">
      <header className="movie_header">
        <div className="movie_headerContent">
          <a href="/movietheater">
            <span className="movie_headerTitle">Movie Theater App</span>
          </a>
          <a href="/" className="movie_backHome">
            <span>Back to Homepage</span>
          </a>
        </div>
      </header>
      <div
        className="movie_hero"
        style={{ backgroundImage: selectBackdrop() }}
        onMouseMove={handleMouseMove}
      >
        <div className="movie_heroContainer">
          {selectedMovie.videos && playTrailer ? renderTrailer() : null}
          {isCursorActive && playTrailer ? (
            <button
              className="movie_closeButton"
              onClick={() => setPlayTrailer(false)}
            >
              Close
            </button>
          ) : null}
          {showPlayTrailerButton()}
          <h1 className="movie_heroTitle">{selectedMovie.title}</h1>
          <p className="movie_heroOverview">
            {selectedMovie.overview ? selectedMovie.overview : null}
          </p>
        </div>
      </div>
      {movies.length === 0 ? (
        <p className="movie_noMovies">No matching movies</p>
      ) : (
        <div className="movie_movieContainer">
          <React.Suspense fallback={<div>Loading...</div>}>
            {renderMovies()}
          </React.Suspense>
        </div>
      )}
      <div className="movie_footer">
        <input
          className="movie_searchBar"
          type="text"
          placeholder="Search movies..."
          onChange={handleInputChange}
          value={query}
        ></input>
      </div>
    </div>
  );
}

export default MovieTheater;
