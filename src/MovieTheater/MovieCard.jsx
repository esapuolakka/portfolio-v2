import React from 'react';
import noImage from '../images/no-image.png';
import styles from './MovieTheater.module.css';

export default function MovieCard({ movie, imageUrl, selectMovie }) {

  return (
    <div className={styles.card}>
        <div className={styles.imageContainer} onClick={() => selectMovie(movie)}>
          {movie.poster_path ?
          <img className={styles.image} src={`${imageUrl}/w500${movie.poster_path}`} alt='Movie poster'/>
          : 
          <img className={styles.image} src={noImage} alt='No poster available'/>
          }
        </div>
        <h5 className={styles.movieTitle}>{movie.title}</h5>
        
    </div>
  )
}