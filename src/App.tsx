import React from 'react'
import CardDeck from './components/cardDeck'
import Match from './Match'
import Menu from './Menu'
import useStore from './store'
import Transition from './components/Transition'
import EndScreen from './components/EndScreen'


function App() {
  const {gameStarted} = useStore();


  return (
    <>
    <Transition />
    <EndScreen />
    {gameStarted ? <Match /> : <Menu />}
    </>

  )
}

export default App
