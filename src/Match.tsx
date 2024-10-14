import React, { useEffect } from 'react'
import styled from 'styled-components'
import CardDeck from './components/cardDeck'
import PlayedCards from './components/PlayedCards'
import useStore from './store'
import CardStack from './components/CardStack'
import ColorSwitcher from './components/ColorSwitcher'
import EnemyPlayer from './components/EnemyPlayer'

const types = ["red","blue","green","yellow"]
const cards = ["0","1","2","3","4","5","6","7","8","9","reverse","block","plus2"]
const common = ["plus4","colorchange"]

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    transition: background 0.7s;
    background-color: #000;
`

const RadialShadow = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(transparent, rgba(0, 0, 0, 0.5));
    pointer-events: none;
    z-index: 1;
`

const colors = {
    red: "rgb(56, 14, 14)",
    blue: "rgb(14, 19, 56)",
    green: "rgb(14, 56, 18)",
    yellow: "rgb(36, 31, 9)",
    black: "black"
}

interface Props {}

function Match(props: Props) {
    const {} = props
    const { setPlayersCards,setPlayedCards, playedCards, playersCards,showColorChanger } = useStore();



    const newGame = () => {
        const cardObject = {}
        for (let i = 0; i < 7; i++) {
            const cardTypeChance = Math.floor(Math.random() * 20); 
            if (cardTypeChance < 18) {
                const type = types[Math.floor(Math.random() * types.length)];
                const card = cards[Math.floor(Math.random() * cards.length)];
                console.log(type,card);
                cardObject[i] = { type, card };    
            } else {
                const card = common[Math.floor(Math.random() * common.length)];
                cardObject[i] = { type: "common", card };
            }
        }
        console.log(Object.values(cardObject));
        setPlayersCards(cardObject);
        
        const type = types[Math.floor(Math.random() * types.length)];
        const card = cards[Math.floor(Math.random() * cards.length)];
        console.log(type,card);
        setPlayedCards({ type,card, x: 1, y: 1 });
    }

    return (
        <Wrapper style={{background: colors[playedCards[Object.values(playedCards).length - 1]?.type]}}>
            <RadialShadow />
            {Object.values(playersCards).length > 0 && <CardDeck /> }
            {Object.values(playedCards).length > 0 && <PlayedCards />}
            {Object.values(playersCards).length > 0 && <CardStack />}
            {showColorChanger && <ColorSwitcher />}
            <EnemyPlayer />
            <button onClick={newGame} style={{zIndex: 919}}>New Game</button>
        </Wrapper>
    )
}

export default Match
