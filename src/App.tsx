import React, { useEffect, useState } from 'react'
import CardDeck from './components/cardDeck'
import Match from './Match'
import Menu from './Menu'
import useStore from './store'
import Transition from './components/Transition'


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
