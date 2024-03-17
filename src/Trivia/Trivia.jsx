import { useState } from 'react';
import styles from './Trivia.module.css';

function Trivia() {
  const [question, setQuestion] = useState('');

  const fetchData = () => {
    fetch('https://opentdb.com/api.php?amount=1')
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Response status not ok');
      }

      return response.json();
    })
    .then(resData => {
      const newQuestion = resData.results[0].question;
      setQuestion(newQuestion);
    })
  }

  return (
    <div className={styles.trivia}>
      <div className={styles.header}>
        <button>Back to Homepage</button>
      </div>
      <div className={styles.main}>
        <button onClick={fetchData}>Fetch a trivia</button>
        <p>{question}</p>
      </div>
    </div>
  );
}

export default Trivia;