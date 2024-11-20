import React from 'react'
import styled from 'styled-components'
import { FaPlus,FaMinus,FaPlay } from "react-icons/fa"; 
import useStore from '../../store.js'

const NumberOfBotsWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
`

const MenuText = styled.p`
    font-size: 16px;
    color: #838383;
`

const MenuButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 18px;
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

function Localpage() {
    const {numberOfPlayers,setNumberOfPlayers,setTransition,setCurrentMenuPage} = useStore();

    const increasePlayers = () => {
        if (numberOfPlayers == 8) return;
        setNumberOfPlayers(numberOfPlayers + 1)
    }

    const decreasePlayers = () => {
        if (numberOfPlayers == 2) return;
        setNumberOfPlayers(numberOfPlayers - 1)
    }

    const StartGame = () => {
        setTransition(true);
    }

    return (
        <>
        <MenuText>Select number of players</MenuText>
        <NumberOfBotsWrapper>
            <MenuButton onClick={decreasePlayers}>
                <FaMinus />
            </MenuButton>
            <PlayerAmount>{numberOfPlayers}</PlayerAmount>
            <MenuButton onClick={increasePlayers}>
                <FaPlus />
            </MenuButton>
        </NumberOfBotsWrapper>
        <MenuButton style={{width: '170px'}} onClick={StartGame}>
            <FaPlay />
            START
        </MenuButton>
        <Back onClick={() => setCurrentMenuPage("main")}>{"← BACK"}</Back>
        </>
    )
}

export default Localpage
