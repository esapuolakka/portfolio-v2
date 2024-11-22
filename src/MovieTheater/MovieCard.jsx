import noImage from '/images/no-image.png';
import './MovieTheater.css';
import PropTypes from 'prop-types';

export default function MovieCard({ movie, imageUrl, selectMovie }) {

  return (
    <div className='movie_card'>
        <div className='movie_imageContainer' onClick={() => selectMovie(movie)}>
          {movie.poster_path ?
          <img className='movie_image' src={`${imageUrl}/w500${movie.poster_path}`} alt='Movie poster' loading='lazy'/>
          : 
          <img className='movie_image' src={noImage} alt='No poster available'/>
          }
        </div>
        <h5 className='movie_movieTitle'>{movie.title}</h5>
        
    </div>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    poster_path: PropTypes.string,
    title: PropTypes.string.isRequired,
  }).isRequired,
  imageUrl: PropTypes.string.isRequired,
  selectMovie: PropTypes.func.isRequired,
};