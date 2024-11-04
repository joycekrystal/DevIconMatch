import { useState, useEffect, useCallback } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';
import matchSound from './sounds/match.mp3';
import mismatchSound from './sounds/mismatch.mp3';
import flipSound from './sounds/flip.mp3';
import winSound from './sounds/win.mp3';
import startSound from './sounds/start.mp3';

const cardImages = [
    { "src": "/img/python-1.svg" },
    { "src": "/img/javascript-1.svg" },
    { "src": "/img/java-1.svg" },
    { "src": "/img/cplus-1.svg" },
    { "src": "/img/ruby-1.svg" },
    { "src": "/img/swift-1.svg" },
];

const audio = {
    match: new Audio(matchSound),
    mismatch: new Audio(mismatchSound),
    flip: new Audio(flipSound),
    win: new Audio(winSound),
    start: new Audio(startSound),
};

function App() {
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [flippedCards, setFlippedCards] = useState([]);

    // Shuffle cards
    const shuffleCards = useCallback(() => {
        const shuffledCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }));

        setCards(shuffledCards);
        resetGame();
        audio.start.play(); // Play start game sound
    }, []); // No dependencies, as it doesn't rely on any state or props

    // Reset game state
    const resetGame = () => {
        setTurns(0);
        setChoiceOne(null);
        setChoiceTwo(null);
        setFlippedCards([]);
    };

    // Handle a card choice
    const handleChoice = (card) => {
        if (!choiceOne) {
            setChoiceOne(card);
            setFlippedCards(prev => [...prev, card.id]);
            audio.flip.play(); // Play flip sound
        } else if (!choiceTwo && card.id !== choiceOne.id) {
            setChoiceTwo(card);
            setFlippedCards(prev => [...prev, card.id]);
            audio.flip.play(); // Play flip sound
        }
    };

    // Reset turn after checking choices
    const resetTurn = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setTurns(prev => prev + 1);
    };

    // Effect to check for matches
    useEffect(() => {
        if (choiceOne && choiceTwo) {
            if (choiceOne.src === choiceTwo.src) {
                audio.match.play(); // Play match sound
                resetTurn(); // Cards match
            } else {
                const timeout = setTimeout(() => {
                    setFlippedCards(prev => prev.filter(id => id !== choiceOne.id && id !== choiceTwo.id)); // Unflip cards
                    audio.mismatch.play(); // Play mismatch sound
                    resetTurn(); // Reset choices
                }, 1000);
                return () => clearTimeout(timeout); // Cleanup timeout
            }
        }
    }, [choiceOne, choiceTwo]);

    // Check for winning condition
    useEffect(() => {
        if (turns === (cardImages.length)) { // Example winning condition based on turns
            audio.win.play(); // Play win sound
        }
    }, [turns]);

    // Start a new game automatically
    useEffect(() => {
        shuffleCards(); // Call shuffleCards when component mounts
    }, [shuffleCards]); // Include shuffleCards in the dependency array

    return (
        <div className="App">
            <h1>Dev Icon Match</h1>
            <button onClick={shuffleCards}>Start a new game</button>
            <div className="card-grid">
                {cards.map(card => (
                    <SingleCard
                        key={card.id}
                        card={card}
                        handleChoice={handleChoice}
                        flipped={flippedCards.includes(card.id) || card === choiceOne || card === choiceTwo}
                    />
                ))}
            </div>
            <p>Turns: {turns}</p>
        </div>
    );
}

export default App;