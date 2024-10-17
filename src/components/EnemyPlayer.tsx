import React, { useEffect, useRef, useState } from 'react'
import useStore from '../store.js'
import useCardgenerator from '../utils/Cardgenerator.js'
import styled from 'styled-components'
import gsap from 'gsap'

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
`

const Card = styled.img`
  width: 135px;
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
    const { currentPlayer,numberOfPlayers } = useStore();
    const cardsRef = useRef<HTMLDivElement>([]);
    const [cards,setCards] = useState({});
    const [rotation,setRotation] = useState(0);
    const [position,setPosition] = useState({});
    const cardObject = useCardgenerator();

    const orientationSetter = () => {
    let positions = {}

    if (numberOfPlayers == 2) {
        positions = {
            top: "-30px",
            left: "50%",
            angle: 180
        }
    }

    if (numberOfPlayers == 3) {
        positions = [
            {
                top: "50%",
                left: "-400px",
                transform: "-10",
                angle: 90
            },
            {
                top: "50%",
                right: "-400px",
                transform: "10",
                angle: 270
            }
        ]
    }

    if (numberOfPlayers == 4) {
        positions = [
            {
                top: "50%",
                left: "-400px",
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
                right: "-400px",
                transform: "10",
                angle: 270
            }
        ]
    }

    const left = positions[playerNo-1]?.left ? positions[playerNo-1].left : positions.left
    const top = positions[playerNo-1]?.top ? positions[playerNo-1].top : positions.top
    const right = positions[playerNo-1]?.right ? positions[playerNo-1].right : positions.right
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
    },[cards])

    useEffect(() => {
        setCards(cardObject);
        orientationSetter();
    },[cardObject])

    return (
        <Wrapper style={{position: "absolute",top: position?.top,right: position?.right, left: position.left, transform: `rotate(${rotation}deg) ${position.left == "50%" ? "translateX(50%)" : ""} ${position.top == "50%" ? `translateX(${position.transform}%)` : ""}`}}>
        {Object.values(cards).map((card,i) => {
            return (
                <Card ref={(el) => cardsRef.current[i] = el} key={i} src="public/cards/1.png" />
            )}
        )}
        </Wrapper>
    )
}

export default EnemyPlayer
