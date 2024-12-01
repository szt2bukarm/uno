import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import useStore from '../store.js'
import { GiClick } from "react-icons/gi";
import useNextPlayer from '../utils/useNextPlayer'
import usePrevPlayer from '../utils/usePrevPlayer'
import {socket, lastCardAttackOnline, attackOnline} from '../socket.js'
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

    background: linear-gradient(transparent 1% ,#000000ec, transparent 99%);
    z-index: 9999;
`

const Text = styled.p`
    font-size: 10vw;
    color: #fff;
    font-family: sans-serif;
    font-weight: 600;
    letter-spacing: -1rem;
`

const Tap = styled(GiClick)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 10rem;
    filter: drop-shadow(0 0 2rem rgb(2, 2, 2));
    z-index: 2;
`

const Pulse = styled.div`
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    top: 20%;
    left: 22.5%;
    transform: translate(-50%, -50%);
    scale: 1;
    animation: pulse 1s infinite;
    @keyframes pulse {
        50% {
            transform: translate(-50%, -50%) scale(2);
        }
    }
`

const SubText = styled.p`
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #ccc;
    font-family: sans-serif;
    text-align: center;
    font-weight: 600;
    margin-top: 1rem;
`

const TapWrapper = styled.div`
    width: 10rem;
    height: 10rem;
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
`


const TapInner = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`

function LastCard() {
    const { playedCards, currentPlayer,hostID,playerID,drawCard,playersCards,lobbyId,onlineMatch,setAttackedPlayerID,setAttackAmount,setLastCardName,setLastCardPlayer,playerNo,lastCardAttack,lastCardName,lastCardPlayer,setCurrentPlayer,setLastCardAttack } = useStore();
    const wrapperRef = useRef(null);
    const textRef = useRef(null);
    const tapRef = useRef(null);
    const getNextPlayer = useNextPlayer();
    const getPrevPlayer = usePrevPlayer();

    const endRound = () => {
        const lastPlayedCard = Object.values(playedCards)[Object.values(playedCards).length - 1];
        gsap.to(wrapperRef.current, {
            opacity: 0,
            duration: 0.15,
            onComplete: () => {
                setLastCardAttack(false);
                if (lastPlayedCard?.type == "common" || lastPlayedCard?.card == "plus2") return;
                setCurrentPlayer(getNextPlayer());
            }
        })
    }

    useEffect(() => {
        if (onlineMatch) return;
        if (lastCardPlayer == playerNo && lastCardAttack) {
            const timeout = setTimeout(() => {
                setAttackedPlayerID(currentPlayer);
                setAttackAmount(2);
                endRound();
            }, Math.random() * 1000 + 500);
            return () => clearTimeout(timeout);
        }

        if (lastCardPlayer != playerNo && lastCardAttack) {
            const timeout = setTimeout(() => {
                endRound();
            }, Math.random() * 1000 + 500);
            return () => clearTimeout(timeout);
        }
    }, [lastCardPlayer,lastCardAttack,playedCards])

    useEffect(() => {
        if (!onlineMatch) return;

        const lastCardHandler = (data) => {
            setLastCardAttack(true);
            setLastCardName(data.name);
            setLastCardPlayer(data.player);
        }

        const lastCardAttackHandler = (data) => {
            if (data.attack) {
                if (onlineMatch && (hostID == playerID)) {
                    const newCards = {...playersCards[currentPlayer]};
                    for (let i = 0; i < 2; i++) {
                      const cardData = drawCard();
                      newCards[Object.keys(playersCards[currentPlayer]).length + i] = { type: cardData.type, card: cardData.card };
                  }
                  attackOnline(lobbyId,newCards,currentPlayer,2)
                }
                endRound();
            }
            if (!data.attack) {
                endRound();
            }
        }

        socket.on('lastcardnotification', lastCardHandler);
        socket.on('lastcardattacknotification', lastCardAttackHandler);
        return () => {
            socket.off('lastcardnotification', lastCardHandler);
            socket.off('lastcardattacknotification', lastCardAttackHandler);
        }
    },[currentPlayer,Object.keys(playersCards[currentPlayer]).length])


    const onClick = () => {
        if (onlineMatch) {
            lastCardAttackOnline(lobbyId,currentPlayer,playerNo);
        }
        
        if (!onlineMatch) {
            if (playerNo != lastCardPlayer) {
                setAttackedPlayerID(currentPlayer);
                setAttackAmount(2);
            }
            endRound();
        }
    }

    useEffect(() => {
        if (lastCardAttack) {
            gsap.set([textRef.current, tapRef.current], {
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
            gsap.to(tapRef.current,{
                y: 0,
                opacity: 1,
                duration: 0.15,
                delay: 0.1
            })
        }
    }, [lastCardAttack])

    return (

        <Wrapper ref={wrapperRef} onClick={onClick} style={{pointerEvents: lastCardAttack ? "all" : "none"}}>
            <Text ref={textRef} style={{textShadow: `0px 0px 5rem #fff`}}>UNO!</Text>
            <SubText>{
                lastCardPlayer == playerNo ? "You only have one card left! Click or tap to dismiss other players attacks!" : `${lastCardName} only has one card left! Click or tap to attack ${lastCardName}.`
            }</SubText>
            <TapWrapper ref={tapRef}>
                <TapInner>
                    <Tap />
                    <Pulse />
                </TapInner>
            </TapWrapper>
        </Wrapper>
    )
}

export default LastCard
