import React from 'react';
import noImage from '/images/no-image.png';
import './MovieTheater.css';

export default function MovieCard({ movie, imageUrl, selectMovie }) {

  return (
    <div className='movie_card'>
        <div className='movie_imageContainer' onClick={() => selectMovie(movie)}>
          {movie.poster_path ?
          <img className='movie_image' src={`${imageUrl}/w500${movie.poster_path}`} alt='Movie poster'/>
          : 
          <img className='movie_image' src={noImage} alt='No poster available'/>
          }
        </div>
        <h5 className='movie_movieTitle'>{movie.title}</h5>
        
    </div>
  )
}