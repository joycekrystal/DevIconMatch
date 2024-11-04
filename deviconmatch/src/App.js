// App.js
import { useState, useEffect } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';

const cardImages = [
    { "src": "/img/python-1.svg" },
    { "src": "/img/javascript-1.svg" },
    { "src": "/img/java-1.svg" },
    { "src": "/img/cplus-1.svg" },
    { "src": "/img/ruby-1.svg" },
    { "src": "/img/swift-1.svg" },   
];

function App() {
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [flippedCards, setFlippedCards] = useState([]);

    // Shuffle cards
    const shuffleCards = () => {
        const shuffledCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }));

        setCards(shuffledCards);
        setTurns(0);
        setChoiceOne(null);
        setChoiceTwo(null);
        setFlippedCards([]); // Reset flipped cards
    };

    // Handle a card choice
    const handleChoice = (card) => {
        if (!choiceOne) {
            setChoiceOne(card);
            setFlippedCards((prev) => [...prev, card.id]); // Flip the card
        } else if (!choiceTwo && card.id !== choiceOne.id) {
            setChoiceTwo(card);
            setFlippedCards((prev) => [...prev, card.id]); // Flip the card
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
                resetTurn(); // Cards match
            } else {
                const timeout = setTimeout(() => {
                    setFlippedCards((prev) => prev.filter(id => id !== choiceOne.id && id !== choiceTwo.id)); // Unflip cards
                    resetTurn(); // Reset choices
                }, 1000);
                return () => clearTimeout(timeout); // Cleanup timeout
            }
        }
    }, [choiceOne, choiceTwo]);

    // Start a new game automatically
    useEffect(() => {
        shuffleCards();
    }, []);

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