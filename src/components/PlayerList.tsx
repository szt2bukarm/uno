import React from 'react'
import styled from 'styled-components'
import useStore from '../store'
import { GiCardRandom } from "react-icons/gi";
import { FaArrowDown } from "react-icons/fa";

const Wrapper = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 30rem;
    padding-block: 1.5rem;
    background: linear-gradient(to right, #000000c3, transparent);
    z-index: 9;
`

const Title = styled.p`
    font-size: 2.4rem;
    font-weight: bold;
    color: #fff;
    padding-left: 2rem;
    font-family: sans-serif;
`

const Player = styled.div`
    position: relative;
    font-size: 2rem;
    display: flex;
    gap: 1rem;
    color: #fff;
    font-family: sans-serif;
    padding: .5rem 2rem;
    transition: all .3s;
    word-break: break-all;
`

const Highlight = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
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

const Arrow = styled(FaArrowDown)`
    color: #fff;
    font-size: 2rem;
    transition: all .3s;
`

function PlayerList() {
    const { reversed,currentPlayer,playerNo, numberOfPlayers,playedCards,playersCards,playerList } = useStore();

    return (
        <Wrapper>
            <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
            <Title>Player List</Title>
            <Arrow style={{transform: reversed ? "rotate(180deg)" : "rotate(0deg)"}}/>
            </div>
            {playerList && Object.values(playerList).map((p) => {
                return (
                <Player key={p.id}>
                    {playerNo == p.idx ? `${p.name} (You)` : `${p.name}`}
                    <Highlight style={{background: currentPlayer === p.idx ? `linear-gradient(to right, ${colors[playedCards[Object.values(playedCards).length - 1]?.type]}, transparent)` : "transparent", left: currentPlayer === p.idx ? "0" : "-100rem"}}/>
                    <GiCardRandom style={{marginLeft: "auto"}}/>
                    <p style={{marginRight: "1rem"}}>{Object.values(playersCards[p.idx]).length}</p>
                </Player>
                )
            })}
            {!playerList && Array.from({ length: numberOfPlayers }, (_, index) => (
                <Player key={index}>
                    {playerNo == index ? "You" : `Bot ${index > playerNo ? index : index+1}`}
                    <Highlight style={{background: currentPlayer === index ? `linear-gradient(to right, ${colors[playedCards[Object.values(playedCards).length - 1]?.type]}, transparent)` : "transparent", left: currentPlayer === index ? "0" : "-100rem"}}/>
                    <GiCardRandom style={{marginLeft: "auto"}}/>
                    <p style={{marginRight: "1rem"}}>{Object.values(playersCards[index]).length}</p>
                </Player>
            ))
        }
        </Wrapper>
    )
}

export default PlayerList
