import React, { useEffect, useRef, useState } from 'react'
import useStore from '../store.js'
import useCardgenerator from '../utils/Cardgenerator.js'
import styled from 'styled-components'
import gsap from 'gsap'

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
    const { currentPlayer,numberOfPlayers,setCurrentPlayer,playedCards,setPlayedCards } = useStore();
    const cardsRef = useRef<HTMLDivElement>([]);
    const [cards,setCards] = useState({});
    const [rotation,setRotation] = useState(0);
    const [position,setPosition] = useState({});
    const cardObject = useCardgenerator();

    const orientationSetter = () => {
    let positions = {}

    if (numberOfPlayers == 2) {
        positions = {
            top: "10px",
            left: "50%",
            angle: 180
        }
    }

    if (numberOfPlayers == 3) {
        positions = [
            {
                top: "-30px",
                left: "50%",
                angle: 180
                },
            {
                top: "50%",
                right: "-200px",
                transform: "10",
                angle: 270
            }
        ]
    }

    if (numberOfPlayers == 4) {
        positions = [
            {
                top: "50%",
                left: `-400px`,
                transform: "-10",
                angle: 90
            },
            {
                top: "-30px",
                left: "50%",
                angle: 180
            },
            {
                top: "50%",
                right: `-400px`,
                transform: "10",
                angle: 270
            }
        ]
    }

    const left = positions[playerNo-1]?.left ? positions[playerNo-1].left : positions.left;
    const top = positions[playerNo-1]?.top ? positions[playerNo-1].top : positions.top;
    const right = positions[playerNo-1]?.right ? positions[playerNo-1].right : positions.right;
    const transform = positions[playerNo-1]?.transform ? positions[playerNo-1].transform : "";
    const angle = positions[playerNo-1]?.angle ? positions[playerNo-1].angle : positions.angle;
    setRotation(angle);
    setPosition({
        left,right,top,transform
    })
    }

    useEffect(() => {
        gsap.set(cardsRef.current, {
            y: -100,
            delay: 0.5
          })
    },[position,rotation])

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
    },[cards,currentPlayer])

    useEffect(() => {
        setCards(cardObject);
        // orientationSetter();
    },[cardObject])

    const getNextPlayer = () => {
        if (currentPlayer == numberOfPlayers-1) return 0;
        return currentPlayer+1;
      }

      const addCardToPlayedCards = (index) => {
        const target = cardsRef.current[index];
        const card = Object.values(cards)[index]
        console.log(target,card.type,card.card)     
        const rect = target.getBoundingClientRect();
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setTimeout(() => {
            const newCards = Object.values(cards).filter((c, i) => c !== card);
            setCards(newCards);
            setCurrentPlayer(getNextPlayer());
            setPlayedCards({
                type: card?.type,
                card: card?.card,
                x: centerX,
                y: centerY,
            })
        }, 2000);

      }

    const botMove = () => {
        const lastCard = playedCards[Object.keys(playedCards).length - 1];
        const commonIndex = Object.values(cards).findIndex(c => c.type == "common");
        const cardIndex = Object.values(cards).findIndex(c => c.card == lastCard.card);
        const typeIndex = Object.values(cards).findIndex(c => c.type == lastCard.type);
        console.log(commonIndex,cardIndex,typeIndex)
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
        {Object.values(cards).map((card,i) => {
            return (
                <Card ref={(el) => cardsRef.current[i] = el} key={i} src={`public/cards/1.png`} />
            )}
        )}
        </Wrapper>
    )
}

export default EnemyPlayer
