import React, { useEffect, useRef, useState } from 'react'
import useStore from '../store.js'
import useNextPlayer from '../utils/useNextPlayer.js'
import styled from 'styled-components'
import gsap from 'gsap'

const colors = ["red","blue","green","yellow"];

const Wrapper = styled.div`
    width: 1000px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    rotate: 180deg;
    transition: opacity .3s;
    transition-delay: 500ms;
`

const Card = styled.img`
  min-width: 135px;
  height: 225px;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.05s;
  user-select: none;
  opacity: 0;
`

interface props {
    playerNo: number,
}

function EnemyPlayer({ playerNo }: props) {
    const { setAttackedPlayerID,setAttackAmount,reversed,setReversed,currentPlayer,numberOfPlayers,setCurrentPlayer,playedCards,setPlayedCards,playersCards,editPlayersCards } = useStore();
    const cardsRef = useRef<HTMLDivElement>([]);
    const getNextPlayer = useNextPlayer();

    useEffect(() => {
        cardsRef.current = cardsRef.current.filter(c => c != null);
        gsap.to(cardsRef.current, {
            opacity: 1,
            delay: 0.5
        })
        cardsRef.current.forEach((c, i) => {
            const base = Math.ceil(0 - cardsRef.current.length / 2);
            gsap.to(c, {
              rotate: `${(base + i) * 5}deg`,
              y: Math.abs(base + i) * 20 + 100,
              x: (base + i) * -50,
              duration: 1,
              delay: 0.5,
              ease: 'circ.inOut',
            });
          });
    },[cardsRef,Object.values(playersCards[playerNo])])

    useEffect(() => {
        editPlayersCards(playerNo,Object.values(playersCards[playerNo]));
    },[playerNo])
    
      const addCardToPlayedCards = (index) => {
        const target = cardsRef.current[index];
        const card = Object.values(playersCards[playerNo])[index];

        let setCard = card?.card
        let setType = card?.type

        if (card.card == "colorchange") {
            const color = colors[Math.floor(Math.random() * colors.length)];
            setType = color;
            setCard = "1";
        }

        if (card.card == "plus2") {
            setTimeout(() => {
                setAttackedPlayerID(getNextPlayer(1));
                setAttackAmount(2);  
              }, 200);
            console.log(getNextPlayer(1));
        }

        if (card.card == "reverse") {
            setReversed(!reversed);
        }

        const initialRect = target.getBoundingClientRect();
        let centerX = initialRect.left + initialRect.width / 2;
        let centerY = initialRect.top + initialRect.height / 2;
      
        setTimeout(() => {
          const updatedRect = target.getBoundingClientRect();
          centerX = updatedRect.left + updatedRect.width / 2;
          centerY = updatedRect.top + updatedRect.height / 2;
      
          const newCards = Object.values(playersCards[playerNo]).filter((c, i) => c !== card);
          editPlayersCards(playerNo,newCards);
          setCurrentPlayer(getNextPlayer(1));
          setPlayedCards({
            type: setType,
            card: setCard,
            x: centerX ,
            y: centerY,
          });
        }, 2000);
      }

    const botMove = () => {
        const lastCard = playedCards[Object.keys(playedCards).length - 1];
        const commonIndex = Object.values(Object.values(playersCards[playerNo])).findIndex(c => c.type == "common");
        const cardIndex = Object.values(Object.values(playersCards[playerNo])).findIndex(c => c.card == lastCard.card);
        const typeIndex = Object.values(Object.values(playersCards[playerNo])).findIndex(c => c.type == lastCard.type);
        if (typeIndex != -1) {
            addCardToPlayedCards(typeIndex);
            return;
        }
        if (cardIndex != -1) {
            addCardToPlayedCards(cardIndex);
            return;
        }
        if (commonIndex != -1) {
            addCardToPlayedCards(commonIndex);
            return;
        }
    }

    useEffect(() => {
        if (currentPlayer == playerNo) {
            botMove();
        }
    },[currentPlayer])

    return (
        <Wrapper style={{opacity: currentPlayer == playerNo ? 1: 0.5}}>
        {Object.values(playersCards[playerNo]).map((card,i) => {
            return (
                <Card ref={(el) => cardsRef.current[i] = el} key={i} src={`public/cards/${card.type}/${card.card}.png`} />
            )}
        )}
        </Wrapper>
    )
}

export default EnemyPlayer
