import React from 'react';
import { useState } from 'react';
import './Homepage.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function Homepage() {

  const [cards, setCards] = useState([
    { id: 1, title: 'Bookstore', image: 'bookstore-thumbnail.png', link: '/bookstore', expanded: false, text: 'This project utilizes the MUI and AgGrid component libraries, as well as the Google Firebase Realtime Database. Users must be authenticated to access the app. Additionally, account deletion functionality is available in the bottom right corner.' },
    { id: 2, title: 'Movie Theater', image: 'movietheater-thumbnail.jpg', link: '/movietheater', expanded: false, text: 'This project integrates The Movie DB API for movie data retrieval and utilizes the YouTube component trailer playback. HTTP requests are handled by Axios and the search functionality has been enhanced with Lodash debounce. Enjoy!' },
    { id: 3, title: 'Trivia', image: 'no-image.png', link: '/trivia', expanded: false, text: 'Another example text for Trivia.' },
    { id: 4, title: 'Card D', image: 'no-image.png', link: '/', expanded: false, text: 'Another example text for Card D.' },
  ]);

  // Toggles the expanded state of the card
  const handleExpand = (id) => {
    setCards((prevState) =>
      prevState.map((card) => ({
        ...card,
        expanded: card.id === id ? !card.expanded : false,
    }))
    );
  };

  return (
  <div className='homepage'>
    <header className='hp_header'>
      <h1 className='hp_title'>Homepage</h1>
    </header>
    <div className='hp_main'>
      <div className='hp_cardsContainer'>

        {cards.map((card) => (
          <div className='hp_card' key={card.id}>
          <a href={card.link} className='hp_cardLink'>
          <div className='hp_cardImage'>
            <img className='hp_image' src={`/images/${card.image}`}/>
          </div>
          </a>
          <div className='hp_cardText'>
            <h3>{card.title}</h3>
            <div className='hp_arrowContainer'>
              {card.expanded && (<div className={`hp_expandedText ${card.expanded ? 'visible' : ''}`}>{card.text}</div>)}
              <div className={`hp_arrow ${card.expanded ? 'open' : ''}`} onClick={() => handleExpand(card.id)}>
                <ArrowBackIosIcon />
              </div>
            </div>
          </div>
        </div>
        ))}

      </div>
    </div>
    <footer className='hp_footer'>
      <p>Copyright © Esa Puolakka {new Date().getFullYear()}.</p>
    </footer>
  
  </div>
  )
}

export default Homepage;