import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import useStore from '../store.js'
import gsap from 'gsap'

const colors = {
    red: "rgb(138, 35, 35)",
    blue: "rgb(31, 42, 127)",
    green: "rgb(32, 122, 41)",
    yellow: "rgb(120, 104, 30)",
    common: "rgb(95, 95, 95)"
}


const Wrapper = styled.div`
    width:100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    background: linear-gradient(transparent 1% ,#000000d3, transparent 99%);
    pointer-events: none;
    z-index: 9999;
`

const Text = styled.p`
    font-size: 10vw;
    color: #fff;
    font-family: sans-serif;
    font-weight: 600;
    letter-spacing: -1rem;
`

function YourTurn() {
    const { blockedPlayerID,playedCards,currentPlayer,playerNo } = useStore();
    const wrapperRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        if (playerNo == currentPlayer) {
            gsap.set(textRef.current, {
                y: 200,
                opacity: 0,
            })
            gsap.set(wrapperRef.current, {
                opacity: 0
            })
            gsap.to(wrapperRef.current, {
                opacity: 1,
                duration: 0.15
            })
            gsap.to(textRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.15,
            })
            gsap.to(textRef.current, {
                y: -200,
                opacity: 0,
                duration: 0.15,
                delay: .8
            })
            gsap.to(wrapperRef.current, {
                opacity: 0,
                duration: 0.15,
                delay: .8
            })
        }
    }, [currentPlayer])

    return (
        <Wrapper ref={wrapperRef}>
            <Text ref={textRef} style={{textShadow: `0px 0px 5rem ${colors[playedCards[Object.values(playedCards).length - 1]?.type]}`}}>{blockedPlayerID == playerNo ? "BLOCKED" : "YOUR TURN"}</Text>
        </Wrapper>
    )
}

export default YourTurn
