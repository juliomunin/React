//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react';

// Base Dados
import {wordsList} from "./data/words";

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages =[
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQtd = 3;


function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters]  = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQtd)
  const [score, setScore] = useState(0)
  
  
  const pickWordAndCategory = useCallback(() => {
    //pega uma categoria randomica
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    
    // pegar uma palavra randomica
    const word = 
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category }
  }, [words]);

//Start secret words Games
const startGame = useCallback(() => {
  clearLetterStates();

  const { word, category } = pickWordAndCategory();

// cria array das letras da palavra
  let wordLetters = word.split("");
  wordLetters = wordLetters.map((l) => l.toLowerCase());
  
  console.log(word, category);
  console.log(wordLetters);


// Fill states

  setPickedWord(word);
  setPickedCategory(category);
  setLetters(wordLetters);

  setGameStage(stages[1].name);
}, [pickWordAndCategory]);

//process o próximo input
const verifyLetter = (letter) =>{

    const normalizedLetter = letter.toLowerCase()

  // Verificar se a letra já foi utilizada
if (
  guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)
) {
  return;
}

// verifica a letra e remove as chances
if(letters.includes(normalizedLetter)) {
  setGuessedLetters((actualGessedLetters) => [ 
    ...actualGessedLetters,
    normalizedLetter,
  ]);
} else {
  setWrongLetters((actualWrongLetters) => [
    ...actualWrongLetters,
    normalizedLetter,
  ]);

  setGuesses((actualGuesses) => actualGuesses - 1);
}

};

const clearLetterStates = () =>{
    setGuessedLetters([]);
    setWrongLetters([]);
}


useEffect(() => {
  if (guesses <= 0){
    // apagar os statesdo jogo
    clearLetterStates();
    setGameStage(stages[2].name);
  }
}, [guesses])

//check condição vitoria

useEffect(() => {
  const uniqueLetters = [...new Set(letters)];

// win condition
if (guessedLetters.length === uniqueLetters.length){
//add score
  setScore(actualScore => actualScore += 100)

// restart game
startGame();
}
}, [guessedLetters, letters, startGame]);



console.log(guessedLetters);
console.log(wrongLetters);

const retry = () => { 
  setScore(0);
  setGuesses(guessesQtd);

  setGameStage(stages[0].name);

};


  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}/>}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
