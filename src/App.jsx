import './App.css'
import Header from './components/Header'
import { languages } from './languages'
import { useState } from 'react'
import { clsx } from "clsx"
import { getRandomWord } from './words'

function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

  const maxWrongGuesses = languages.length;

  const wrongGuessCount = guessedLetters.filter(letter => (
    !currentWord.includes(letter)
  )).length;

  const isWinner = currentWord.split('').every(letter => guessedLetters.includes(letter));
  const isLoser = wrongGuessCount >= maxWrongGuesses;
  const isGameOver = isWinner || isLoser;

  const addGuessedLetter = (letter) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter])
    }
  }

  const languageList = languages.map((language, idx) => (
    <span
      className="rounded-md text-[0.875rem] p-0.5 chip relative"
      style={{
        backgroundColor: language.backgroundColor,
        color: language.color,
      }}
      key={language.name}
    >
      {language.name}
      {wrongGuessCount > idx && (
        <span
          className="absolute inset-0 flex items-center justify-center bg-black/70 text-[0.85rem] z-10"
          style={{ borderRadius: 'inherit' }}
        >
          💀
        </span>
      )}
    </span>
  ))

  const letterElements = currentWord.split('').map((letter, idx) => (
    <span
      className="w-[40px] h-[40px] bg-[#323232] text-white font-semibold text-center border-[#F9F4DA] border-b-1 rounded-md flex items-center justify-center"
      key={idx}
    >
      {guessedLetters.includes(letter) ? letter.toUpperCase() : "__"}
    </span>
  ))

  const keyboardElements = alphabet.map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)

    const className = clsx(
      "w-[35px] h-[35px] bg-[#FCBA29] font-semibold text-center rounded-md flex items-center justify-center cursor-pointer border-[#D7D7D7] border-1",
      {
        "bg-green-500 text-white": isCorrect,
        "bg-red-500 text-white": isWrong,
        "opacity-50 pointer-events-none": isGuessed || isGameOver,
      }
    )

    return (
      <button
        className={className}
        key={letter}
        onClick={() => addGuessedLetter(letter)}
        disabled={isGuessed || isGameOver}
      >
        {letter.toUpperCase()}
      </button>
    )
  })
  
  const handleNewGame = () =>  {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <Header />

      {isGameOver && (
        <section
          className={clsx(
            'flex flex-col items-center p-2 rounded-[4px] shadow-lg min-w-[350px] text-[#F9F4DA]',
            {
              'bg-[#10A95B]': isWinner,
              'bg-red-600': isLoser,
            }
          )}
        >
          {isWinner ? (
            <>
              <h2 className='text-[1.25rem] font-semibold'>You Win!</h2>
              <p>Well done! 🎉</p>
            </>
          ) : (
            <>
              <h2 className='text-[1.25rem] font-semibold'>Game Over!</h2>
              <p>The word was: <span className="font-bold">{currentWord.toUpperCase()}</span></p>
            </>
          )}
        </section>
      )}

      <section className='flex flex-wrap justify-center items-center gap-2 p-4 mt-4 max-w-[350px]'>
        {languageList}
      </section>

      <section className='flex justify-center items-center gap-2 p-4 mt-4 max-w-[350px]'>
        {letterElements}
      </section>

      <section className='flex flex-wrap justify-center items-center gap-2 p-4 mt-4 max-w-[350px]'>
        {keyboardElements}
      </section>

      {isGameOver && (
        <button
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition duration-200"
          onClick={handleNewGame}
        >
          New Game
        </button>
      )}
    </div>
  )
}

export default App
