import React, { useState, useEffect } from 'react';
import './App.css'; // Custom modern styling with TailwindCSS/Material-UI

const App = () => {
  const [playerId, setPlayerId] = useState('');
  const [cards, setCards] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'init') {
        setPlayerId(message.playerId);
        setCards(message.cards);
      }
      
      if (message.type === 'number-drawn') {
        setDrawnNumbers((prevNumbers) => [...prevNumbers, message.number]);
      }

      if (message.type === 'game-end') {
        setWinner(message.winner);
      }
    };

    return () => ws.close();
  }, []);

  // Function to highlight numbers on the card
  const renderCard = (card) => {
    return (
      <div className="card">
        {card.map((number, index) => (
          <div key={index} className={`number ${drawnNumbers.includes(number) ? 'highlighted' : ''}`}>
            {number}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bingo Game</h1>
        {winner && <h2>Player {winner} won!</h2>}
        <div className="cards-container">
          {cards.map((card, index) => (
            <div key={index} className="card-container">
              <h3>Card {index + 1}</h3>
              {renderCard(card)}
            </div>
          ))}
        </div>
        <div className="drawn-numbers">
          <h3>Drawn Numbers</h3>
          {drawnNumbers.map((num, idx) => (
            <span key={idx} className="drawn-number">{num}</span>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
