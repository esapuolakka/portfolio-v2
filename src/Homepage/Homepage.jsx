import React from 'react';
import { useState } from 'react';
import styles from './Homepage.module.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function Homepage() {

  const [cards, setCards] = useState([
    { id: 1, title: 'Bookstore', image: 'bookstore-thumbnail.png', link: '/bookstore', expanded: false, text: 'This project utilizes the MUI and AgGrid component libraries, as well as the Google Firebase Realtime Database. Users must be authenticated to access the app. Additionally, account deletion functionality is available in the bottom right corner.' },
    { id: 2, title: 'Movie Theater', image: 'movietheater-thumbnail.jpg', link: '/movietheater', expanded: false, text: 'This project integrates The Movie DB API for movie data retrieval and utilizes the YouTube component trailer playback. HTTP requests are handled by Axios and the search functionality has been enhanced with Lodash debounce. Enjoy!' },
    { id: 3, title: 'Card C', image: 'no-image.png', link: '/', expanded: false, text: 'Another example text for Card C.' },
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
  <div className={styles.homepage}>
    <header className={styles.header}>
      <h1 className={styles.title}>Homepage</h1>
    </header>
    <div className={styles.main}>
      <div className={styles.cardsContainer}>

        {cards.map((card) => (
          <div className={styles.card} key={card.id}>
          <a href={card.link}>
          <div className={styles.cardImage}>
            <img className={styles.image} src={`src/images/${card.image}`}/>
          </div>
          </a>
          <div className={styles.cardText}>
            <h3>{card.title}</h3>
            <div className={styles.arrowContainer}>
              {card.expanded && (<div className={`${styles.expandedText} ${card.expanded ? styles.visible : ''}`}>{card.text}</div>)}
              <div className={`${styles.arrow} ${card.expanded ? styles.open : ''}`} onClick={() => handleExpand(card.id)}>
                <ArrowBackIosIcon />
              </div>
            </div>
          </div>
        </div>
        ))}

      </div>
    </div>
    <footer className={styles.footer}>
      <p>Copyright © Esa Puolakka {new Date().getFullYear()}.</p>
    </footer>
  
  </div>
  )
}

export default Homepage;