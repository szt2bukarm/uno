import React, { useEffect } from 'react'
import styled from 'styled-components'
import CardDeck from './components/cardDeck'
import PlayedCards from './components/PlayedCards'
import useStore from './store'
import {generateFullDeck,initializePlayers} from './utils/initializer'
import CardStack from './components/CardStack'
import ColorSwitcher from './components/ColorSwitcher'
import EnemyPlayer from './components/EnemyPlayerWrapper'
import EnemyPlayerWrapper from './components/EnemyPlayerWrapper'
import PlayerList from './components/PlayerList'
import YourTurn from './components/YourTurn'

const types = ["red","blue","green","yellow"]
const cards = ["0","1","2","3","4","5","6","7","8","9"]

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    transition: background 0.7s;
    background-color: #000;
    overflow: hidden;
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


function Match() {
    const { setPlayedCards,numberOfPlayers, playedCards,setPlayersCards, playersCards,setDeck,playerList } = useStore();

    const newGame = () => {
        const data = initializePlayers(numberOfPlayers);
        setCurrentPlayer(0);
        setDeck(data.deck);
        setPlayersCards(data.cards);
        setPlayedCards({ type: data.type,card: data.card, x: 1, y: 1 });
    }

    useEffect(() => {
        if (onlineMatch) return;
        newGame();
    },[])

    useEffect(() => {
        let isUserInitiated = true;
    
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isUserInitiated) {
                event.preventDefault();
                event.returnValue = 'Game is still in progress. If you leave, the game will be cancelled for everyone.';
            }
        };
    
        const handleUnload = () => {
            if (isUserInitiated) {
                socket.emit('playerdisconnected', lobbyId);
            }
        };
    
        const listenToPlayerDisconnected = () => {
            isUserInitiated = false;
            alert('A player left and the game has been cancelled.');
            window.location.reload();
        };
    
        socket.on('playerdisconnectednotification', listenToPlayerDisconnected);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);
    
        return () => {
            socket.off('playerdisconnectednotification', listenToPlayerDisconnected);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
        };
    }, [socket, lobbyId]);
    
    

    return (
        <Wrapper style={{background: colors[playedCards[Object.values(playedCards).length - 1]?.type]}}>
            <RadialShadow />
            {Object.values(playersCards).length > 0 && <YourTurn />}
            {Object.values(playedCards).length > 0 && <PlayedCards />}
            {Object.values(playersCards).length > 0 && <CardStack />}
            {Object.values(playersCards).length > 0 && <EnemyPlayerWrapper />}
            {Object.values(playersCards).length > 0 && <CardDeck /> }
            {Object.values(playersCards).length > 0 && <PlayerList />}
            {Object.values(playersCards).length > 0 && <LastCard />}
            {/* <button onClick={newGame} style={{zIndex: 999}}>New Game</button> */}
        </Wrapper>
    )
}

export default Match
