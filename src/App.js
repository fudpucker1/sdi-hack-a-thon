import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [deckId, setDeckId] = useState(null);
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [player1Card, setPlayer1Card] = useState(null);
  const [player2Card, setPlayer2Card] = useState(null);
  const [isPlayer1CardDrawn, setIsPlayer1CardDrawn] = useState(false);
  const [isPlayer2CardDrawn, setIsPlayer2CardDrawn] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    async function createDeck() {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const data = await response.json();
      setDeckId(data.deck_id);
    }

    createDeck();
  }, []);

  useEffect(() => {
    compareCards();
  }, [player1Card, player2Card]);

  const drawCards = async () => {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);
    const data = await response.json();

    if (!data.success) {
      if (player1Deck > player2Deck){
        setWinner(`Out of Cards - Player 1 Wins!!!!`);
      } else if (player1Deck < player2Deck) {
        setWinner(`Out of Cards - Player 2 Wins!!!!`);
      } else {
        setWinner(`Out of Cards - War Never Changes!!!!`);
      }
    } else {
      setPlayer1Card(data.cards[0]);
      setPlayer2Card(data.cards[1]);
      setIsPlayer1CardDrawn(true);
      setIsPlayer2CardDrawn(true);
    }
  };

  const compareCards = () => {
    if (player1Card && player2Card) {
      const player1Value = getValue(player1Card.value);
      const player2Value = getValue(player2Card.value);

      if (player1Value > player2Value) {
        setWinner('Player 1 Wins');
        setPlayer1Deck(prevDeck => [...prevDeck, player1Card, player2Card]);
      } else if (player2Value > player1Value) {
        setWinner('Player 2 Wins');
        setPlayer2Deck(prevDeck => [...prevDeck, player1Card, player2Card]);
      } else {
        setWinner('War!');
        setPlayer1Deck(prevDeck => [...prevDeck, player1Card]);
        setPlayer2Deck(prevDeck => [...prevDeck, player2Card]);
      }
    }
  };

  const getValue = value => {
    switch (value) {
      case 'ACE':
        return 14;
      case 'KING':
        return 13;
      case 'QUEEN':
        return 12;
      case 'JACK':
        return 11;
      default:
        return parseInt(value);
    }
  };

  const restartGame = async () => {
    setWinner(null);
    setPlayer1Deck([]);
    setPlayer2Deck([]);
    setPlayer1Card(null);
    setPlayer2Card(null);
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
    const data = await response.json();
    if (data.success) {
      drawCards();
    }
  };

  return (
    <div className="game-container">
      <h1>War Game</h1>
      <div className="player-container">
        <div className="player">
          <h3>Player 1</h3>
          {player1Card && (
            <img src={player1Card.image} alt={player1Card.code} className={`card-image ${isPlayer1CardDrawn ? 'card-tilt-player1' : ''}`} />
          )}
          <h4 className="deck-size">Deck Size: {player1Deck.length}</h4>
        </div>
        <div className="player">
          <h3>Player 2</h3>
          {player2Card && (
            <img src={player2Card.image} alt={player2Card.code} className={`card-image ${isPlayer2CardDrawn ? 'card-tilt-player2' : ''}`} />
          )}
          <h4 className="deck-size">Deck Size: {player2Deck.length}</h4>
        </div>
      </div>
      <div className="buttons-container">
        {winner && (
          <div>
            <h2>{winner}</h2>
          </div>
        )}
          <div>
            <button onClick={drawCards}>Draw Cards</button>
            <button onClick={restartGame}>Restart Game</button>
          </div>
      </div>
    </div>
  );

};

export default App;
