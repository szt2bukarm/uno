import React from 'react'
import CardDeck from './components/cardDeck'
import Match from './Match'
import Menu from './Menu'
import useStore from './store'
import Transition from './components/Transition'


function App() {
  const {gameStarted} = useStore();


  return (
    <>
    <Transition />
    {gameStarted ? <Match /> : <Menu />}
    </>

  )
}

export default App
