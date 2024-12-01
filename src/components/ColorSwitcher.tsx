import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useStore from '../store'
import useNextPlayer from '../utils/useNextPlayer'
import { cardPlayedOnline,attackOnline,changePlayerOnline } from '../socket'
import gsap from 'gsap'

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00000070;
    pointer-events: all;
    z-index: 999;
`

const Wheel = styled.div`
    position: relative;
    width: 30rem;
    height: 30rem;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: inset 0 0 1rem rgba(0, 0, 0, 0.5);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: .5rem;
    overflow: hidden;
    padding: 1rem;
    pointer-events: all;
`
const Color1 = styled.div`
    width: 100%;
    height: 100%;
    background-color: #4ec657;
    box-shadow: inset 0 0 1rem #245c29;
    border-radius: 100% 0 0 0;
    transition: all .2s;
    cursor: pointer;

    &:hover {
        box-shadow: inset 0 0 5rem #245c29;
    }
`
const Color2 = styled.div`
    width: 100%;
    height: 100%;
    background-color: #324be3;
    box-shadow: inset 0 0 1rem #242b5c;
    border-radius: 0 100% 0 0;
    transition: all .2s;
    cursor: pointer;

    &:hover {
        box-shadow: inset 0 0 5rem #242b5c;
    }

`
const Color3 = styled.div`
    width: 100%;
    height: 100%;
    background-color: #ff1719;
    box-shadow: inset 0 0 1rem #5c2424;
    border-radius: 0 0 0 100%;
    transition: all .2s;
    cursor: pointer;

    &:hover {
        box-shadow: inset 0 0 5rem #5c2424;
    }
`
const Color4 = styled.div`
    width: 100%;
    height: 100%;
    background-color: #ffde18;
    box-shadow: inset 0 0 1rem #5c5624;
    border-radius: 0 0 100% 0;
    transition: all .3s;
    cursor: pointer;

    &:hover {
        box-shadow: inset 0 0 5rem #5c5624;
    }
`

function ColorSwitcher() {
    const wheelRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { setExpandCards,drawCard,deck,lobbyId,onlineMatch,playersCards,playerNo,basicColorChanger,setBasicColorChanger,setPlayedCards,playedCards,setShowColorChanger,setCurrentPlayer,setAttackAmount,setAttackedPlayerID } = useStore();
    const getNextPlayer = useNextPlayer();

    useEffect(() => {
        if (isOpen) return;
        gsap.set(wheelRef.current, {
            scale: 0.8,
            opacity: 0.5,
            y: 100
        })
        gsap.set(wrapperRef.current, {
            opacity: 0
        })
        gsap.to(wrapperRef.current, {
            opacity: 1,
            duration: 0.4
        })
        gsap.to(wheelRef.current, {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.2,
            delay: 0.15,
            onComplete: () => {
                setIsOpen(true);
            }
        })
    })

    const onLeave = () => {
        gsap.to(wheelRef.current, {
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
        });
    }

    const tiltHandler = (e: React.MouseEvent) => {
        const wrapper = e.currentTarget.getBoundingClientRect();
    
        const x = (e.clientX - (wrapper.left + wrapper.width / 2)) / 10;
        const y = (e.clientY - (wrapper.top + wrapper.height / 2)) / 10;
    
        gsap.to(wheelRef.current, {
          rotateX: -y,
          rotateY: x,
          x: x,
          y: y,
          transformPerspective: 1500,
        });
      };

      const checkColorAvailability = (color: string) => {
        const cards = Object.values(playersCards[playerNo]);
        return cards.some((card) => card.type === color);
      }
 
      const setColor = (color: string) => {
        gsap.to(wrapperRef.current, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                setBasicColorChanger(true);
                setShowColorChanger(false);
                if (!checkColorAvailability(color) || !basicColorChanger) {
                    setTimeout(() => {
                        setCurrentPlayer(getNextPlayer());
                        setExpandCards(false);
                        changePlayerOnline(lobbyId,getNextPlayer());
                    }, basicColorChanger ? 0 : 200);
                }

                if (onlineMatch) {
                    cardPlayedOnline(lobbyId,color,basicColorChanger ? "colorchange" : "plus4",0,Object.values(playersCards[playerNo]),playerNo)

                    if (!basicColorChanger) {
                        const nextPlayer = getNextPlayer();
                        const newCards = {...playersCards[nextPlayer]};
                        for (let i = 0; i < 4; i++) {
                            const cardData = drawCard();
                            newCards[Object.keys(playersCards[nextPlayer]).length + i] = { type: cardData.type, card: cardData.card };
                        }    
                        attackOnline(lobbyId,newCards,nextPlayer,4)
                        changePlayerOnline(lobbyId,getNextPlayer());    
                    }
                }

                setPlayedCards({
                    type: color,
                    card: basicColorChanger ? "colorchange" : "plus4",
                    x: playedCards[Object.keys(playedCards).length - 1]?.x,
                    y: playedCards[Object.keys(playedCards).length - 1]?.y,
                });
                if (!basicColorChanger) {
                    setAttackAmount(4);
                    setAttackedPlayerID(getNextPlayer());
                }
            }
        })
      }

    return (
        <Wrapper ref={wrapperRef}>
            <Wheel ref={wheelRef} onMouseMove={tiltHandler} onMouseLeave={onLeave}>
                <Color1 onClick={() => setColor("green")}/>
                <Color2 onClick={() => setColor("blue")}/>
                <Color3 onClick={() => setColor("red")}/>
                <Color4 onClick={() => setColor("yellow")}/>
            </Wheel>
        </Wrapper>
    )
}

export default ColorSwitcher
