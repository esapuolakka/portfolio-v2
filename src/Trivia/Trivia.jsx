import { useState } from 'react';
import './Trivia.css';
import { useNavigate } from 'react-router-dom';

function Trivia() {
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

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

  const navigateHome = () => {
    navigate('/')
  }

  return (
    <div className='trivia'>
      <div className='tr_header'>
        <button className='tr_backToHome' onClick={navigateHome}>Back to Homepage</button>
      </div>
      <div className='tr_main'>
        <div className='tr_content'>
          <button className='tr_button' onClick={fetchData}>Fetch a trivia</button>
          {question != '' ? <div className='tr_p'><p>{question}</p></div>
          :
          <div className='tr_p'></div> }
        </div>
      </div>
    </div>
  );
}

export default Trivia;