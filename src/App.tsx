import React, { useEffect, useState } from 'react'
import CardDeck from './components/cardDeck'
import Match from './Match'
import Menu from './Menu'
import useStore from './store'
import Transition from './components/Transition'
import EndScreen from './components/EndScreen'
    // List of card image paths to preload (you can adjust it to your setup)
    const cardImages = [
      "cards/1.png",
      "cards/common/colorchange.png",
      "cards/common/plus4.png",
      "cards/red/0.png",
      "cards/red/1.png",
      "cards/red/2.png",
      "cards/red/3.png",
      "cards/red/4.png",
      "cards/red/5.png",
      "cards/red/6.png",
      "cards/red/7.png",
      "cards/red/8.png",
      "cards/red/9.png",
      "cards/red/reverse.png",
      "cards/red/block.png",
      "cards/red/plus2.png",
      "cards/blue/0.png",
      "cards/blue/1.png",
      "cards/blue/2.png",
      "cards/blue/3.png",
      "cards/blue/4.png",
      "cards/blue/5.png",
      "cards/blue/6.png",
      "cards/blue/7.png",
      "cards/blue/8.png",
      "cards/blue/9.png",
      "cards/blue/reverse.png",
      "cards/blue/block.png",
      "cards/blue/plus2.png",
      "cards/green/0.png",
      "cards/green/1.png", 
      "cards/green/2.png",
      "cards/green/3.png", 
      "cards/green/4.png",     
      "cards/green/5.png",
      "cards/green/6.png",
      "cards/green/7.png",
      "cards/green/8.png",
      "cards/green/9.png",
      "cards/green/reverse.png",
      "cards/green/block.png",
      "cards/green/plus2.png",
      "cards/yellow/0.png",
      "cards/yellow/1.png", 
      "cards/yellow/2.png",
      "cards/yellow/3.png", 
      "cards/yellow/4.png",     
      "cards/yellow/5.png",
      "cards/yellow/6.png",
      "cards/yellow/7.png",
      "cards/yellow/8.png",
      "cards/yellow/9.png",
      "cards/yellow/reverse.png",
      "cards/yellow/block.png",
      "cards/yellow/plus2.png",
  ];


function App() {
  const {gameStarted} = useStore();
  const [loading,setLoading] = useState(true);


  const preloadUNOCardImages = (cards) => {
    return new Promise((resolve, reject) => {
        let loadedCount = 0;
        const totalCards = cards.length;

        cards.forEach((card) => {
            const img = new Image();
            img.src = card; 
            img.onload = () => {
                loadedCount += 1;
                if (loadedCount === totalCards) {
                    resolve();
                }
            };
            img.onerror = reject;
        });
    });
};

  useEffect(() => {
      const loadCards = async () => {
          try {
              await preloadUNOCardImages(cardImages);
              setLoading(false); 
          } catch (error) {
              console.error("Error loading images:", error);
              setLoading(false);
          }
      };

      loadCards();
  }, []);

  if (loading) {
      return (
        <p style={{color: "white"}}>Loading</p>
      );
  }

  return (
    <>
    <Transition />
    <EndScreen />
    {gameStarted ? <Match /> : <Menu />}
    </>

  )
}

export default App
