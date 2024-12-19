/* eslint-disable react/no-unescaped-entities */
import Die from "./Die"
import { useEffect, useRef,useState } from "react"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

export default function App() {
  
  const [dice, setDice] = useState(()=>generateAllNewDice())
  const btnRef = useRef();  

  let gameWon = dice.every(die => die.isHeld && die.value === dice[0].value)

  useEffect(()=>{
    if(gameWon)
      btnRef.current.focus();
  },[gameWon])
  
  function hold(id)
  {
    setDice(prevDice => prevDice.map((dice)=> dice.id === id ? {...dice, isHeld: !dice.isHeld} : dice  ))
  }

  function generateAllNewDice()
  {
    return new Array(10)
                .fill(0)
                .map(()=> 
                  ({
                    value:Math.ceil(Math.random()*6),
                    isHeld: false,
                    id:nanoid()
                  }))
  }

  function rollDice()
  {
    if(gameWon)
    {
      setDice(generateAllNewDice());      
    } else
    {
      setDice(oldDice => oldDice.map(dice=> dice.isHeld ? dice : {
        ...dice,
        value: Math.ceil(Math.random()*6) })
      )
    }  
    
  }

  const diceElements = dice.map(diceObj=> <Die gameWon={gameWon} key={diceObj.id} value={diceObj.value} isHeld={diceObj.isHeld} hold={()=>hold(diceObj.id)} />)
  
  return (
    <>
      <main>
        {gameWon && <Confetti />}
        <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press 'New Game' to start again.</p>}
         </div>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
        {diceElements}
        </div>       
        <button className="roll-dice" onClick={rollDice} ref={btnRef}>{gameWon ? "New Game" : "Roll"}</button>
      </main>
    </>
  )
}
