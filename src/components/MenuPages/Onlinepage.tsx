import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IoEnter } from "react-icons/io5"; 
import useStore from '../../store.js'
import { socket, checkLobby } from '../../socket'

const MenuText = styled.p`
    font-size: 16px;
    color: #838383;
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

const PlayerAmount = styled.p`
    font-size: 30px;
    color: #000;
`

const Back = styled.p`
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
    color: #000;
    cursor: pointer;

    &:hover {
        color: #838383;
    }
`

function Onlinepage() {
    const [name,setName] = useState('');
    const [code,setCode] = useState('');
    const [error,setError] = useState('');
    const {setCurrentMenuPage, setPlayerName,setPremadeLobby,setLobbyId} = useStore();

    const createGame = () => {
        // if (name.length != 0 && code.length != 0) {}
        if (name.length != 0 && code.length == 0) {
            setPremadeLobby(false);
            setPlayerName(name);
            setCurrentMenuPage('lobby');
        }
    }

    const joinGame = async () => {
        if (name.length != 0 && code.length != 0) {
            const lobbyData = await checkLobby(code,name);
            if (lobbyData.status != "success") {
                setError(lobbyData.message)
                return;
            }

            setPremadeLobby(true);
            setPlayerName(name);
            setLobbyId(code);
            setCurrentMenuPage('lobby');
        }
    }

    useEffect(() => {
        setError("");
        socket.connect();
        return () => {
            socket.disconnect();
        }
    },[])

    return (
        <>
        <MenuText>Enter your name:</MenuText>
        <MenuInput placeholder='Name' onChange={(e) => setName(e.target.value)} value={name}/>
        <MenuText>Enter room code:</MenuText>
        <MenuInput placeholder='Room code' onChange={(e) => setCode(e.target.value)} value={code.toUpperCase()}/>
        {error.length != 0 && <MenuText>{error}</MenuText>}
        <MenuButton onClick={joinGame} style={{opacity: (name.length == 0 || code.length == 0) ? 0.5 : 1, cursor: (name.length == 0 || code.length == 0) ? 'not-allowed' : 'pointer'}}>
            <IoEnter />
            Join
        </MenuButton>
        <MenuButton onClick={createGame} style={{opacity: (name.length == 0 || code.length > 0) ? 0.5 : 1, cursor: (name.length == 0 || code.length > 0) ? 'not-allowed' : 'pointer'}}>
            <IoEnter />
            Create game
        </MenuButton>
        <Back onClick={() => setCurrentMenuPage("main")}>{"← BACK"}</Back>
        </>
    )
}

export default Onlinepage
