import React from 'react'
import styled from 'styled-components'
import useStore from '../store'
import { GiCardRandom } from "react-icons/gi";

const Wrapper = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 300px;
    padding-block: 15px;
    background: linear-gradient(to right, #000000c3, transparent);
    z-index: 9;
`

const Title = styled.p`
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    padding-left: 20px;
    font-family: sans-serif;
`

const Player = styled.div`
    position: relative;
    font-size: 20px;
    display: flex;
    gap: 10px;
    color: #fff;
    font-family: sans-serif;
    padding: 5px 20px;
    transition: all .3s;
`

const Highlight = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    /* left: -1000px; */
    left: 0;
    top: 0;
    z-index: -1;
    transition: all .25s;
`

const colors = {
    red: "rgb(138, 35, 35)",
    blue: "rgb(31, 42, 127)",
    green: "rgb(32, 122, 41)",
    yellow: "rgb(120, 104, 30)",
    common: "rgb(95, 95, 95)"
}


function PlayerList() {
    const { currentPlayer, numberOfPlayers,playedCards,playersCards } = useStore();

    return (
        <Wrapper>
            <Title>Player List</Title>
            {Array.from({ length: numberOfPlayers }, (_, index) => (
                <Player key={index}>
                    Player {index + 1}
                    <Highlight style={{background: currentPlayer === index ? `linear-gradient(to right, ${colors[playedCards[Object.values(playedCards).length - 1]?.type]}, transparent)` : "transparent", left: currentPlayer === index ? "0" : "-1000px"}}/>
                    <GiCardRandom style={{marginLeft: "auto"}}/>
                    <p style={{marginRight: "10px"}}>{Object.values(playersCards[index]).length}</p>
                </Player>
            ))}
        </Wrapper>
    )
}

export default PlayerList
