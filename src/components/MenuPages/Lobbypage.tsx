import React, { useEffect, useState } from 'react'
import {socket,connectSocket,createLobby,joinLobby,leaveLobby,startGame} from '../../socket'
import useStore from '../../store'
import {initializePlayers} from '../../utils/initializer'
import styled from 'styled-components'

const MenuText = styled.p`
    font-size: 16px;
    color: #838383;
`

const MenuTextPrimary = styled.p`
    font-size: 20px;
    color: #000;
    font-weight: bold;
    margin-bottom: 2px;
`

const MenuInput = styled.input`
    font-size: 18px;
    color: #000;
    padding: 10px 20px;
    border-radius: 15px;
    border: 2px solid #000;
    width: 80%;
    background-color: #fff;
`

const MenuButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 18px;
    width: 200px;
    height: 40px;
    color: #fff;
    background-color: #000;
    border: 2px solid #000;
    padding: 10px 20px;
    border-radius: 15px;
    transition: all 0.075s;

    &:hover {
        cursor: pointer;
        background-color: #fff;
        color: #000;
    }
`

const Code = styled.p`
    font-size: 50px;
    color: #000;
    font-weight: bold;
    letter-spacing: 2px;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: center;
    justify-content: center;
    margin-block: 10px;
`

const ConnectedPlayersWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 90%;
    margin-bottom: auto;
`

const Player = styled.p`
    font-size: 16px;
    color: #000;
`


function Lobbypage() {
    const {setOnlineMatch,playerName,setLobbyId,lobbyId,premadeLobby,setCurrentMenuPage,setPlayerNo,setPlayerList,setNumberOfPlayers,setTransition,setDeck,setPlayersCards,setPlayedCards,setCurrentPlayer} = useStore();
    const [gameHost,setGameHost] = useState("");
    const [playerId, setPlayerId] = useState("");
    const [connectedPlayers,setConnectedPlayers] = useState({});

    const initializeLobby = async () => {
        createLobby(playerName).then(data => {
            setLobbyId(data.lobbyId)
            setPlayerId(data.player.id)
            setConnectedPlayers(data.players)
            setGameHost(data.host)
        })
    }

    const joinPremadeLobby = async () => {
        joinLobby(lobbyId,playerName).then(data => {
            setLobbyId(data.lobbyId)
            setPlayerId(data.player.id)
            setConnectedPlayers(data.players)
            setGameHost(data.host)
        })
    }

    useEffect(() => {
        connectSocket();
        if (premadeLobby) {
            joinPremadeLobby();
        } else {
            initializeLobby();
        }
    
        socket.on('playerjoined', (data) => {
            setConnectedPlayers(data.players);
        });

        socket.on('playerleft', (data) => {
            setConnectedPlayers(data.players);
        })

        socket.on('hostleft', () => {   
            console.log("hostleft");
            setLobbyId(null);
            setCurrentMenuPage("online");
        })

        socket.on('startgame', (data) => {
            console.log(data);
            setPlayerNo(data.index);
            setPlayerList(data.players);
            console.log(data.players);
            setNumberOfPlayers(data.players.length)
            setDeck(data.deck);
            setPlayersCards(data.playersCards);
            setPlayedCards({type: data.firstCard.type, card: data.firstCard.card, x: 1, y: 1});
            setCurrentPlayer(0);
            setTransition(true);
            setOnlineMatch(true);
        })
    
        return () => {
            socket.off('playerjoined');
            socket.off('playerleft');
            socket.off('hostleft');
        };
    }, []); 

    useEffect(() => {
        if(!lobbyId) return;
        const handleBeforeUnload = () => {
            leaveLobby(lobbyId); 
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload',handleBeforeUnload)
        }
    },[lobbyId])

    const start = () => {
        if (Object.values(connectedPlayers).length == 0) return;
        const data = initializePlayers(Object.values(connectedPlayers).length);
        const deck = data.deck;
        const cards = data.cards;
        const initialType = data.type;
        const initialCard = data.card;
        startGame(lobbyId,deck,cards,initialType,initialCard);
    }

    

    return (
        <>
        <Column>
        <MenuText>Lobby code:</MenuText>
        <Code>{lobbyId}</Code>
        </Column>
        <ConnectedPlayersWrapper>
            <MenuTextPrimary>Players: ({connectedPlayers.length}/8)</MenuTextPrimary>
            {Object.values(connectedPlayers).map((p,i) => <Player style={{fontWeight: p.id == playerId ? 600 : 400,fontStyle: p.id == playerId ? "italic" : "normal"}} key={i}>{p.name} {gameHost == p.id ? "(Host)" : ""}</Player>)}
        </ConnectedPlayersWrapper>
        <Column>
            {playerId == gameHost && <MenuButton onClick={start} style={{opacity: connectedPlayers.length > 1 ? 1 : 0.5,cursor: connectedPlayers.length > 1 ? "pointer" : "not-allowed"}}>START</MenuButton>}
            {playerId != gameHost && <MenuText>Waiting for host to start.</MenuText> }
        </Column>
        </>
    )
}

export default Lobbypage
