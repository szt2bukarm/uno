import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import Card from './Card'
import useStore from '../store.js'
import gsap from 'gsap'
import {MotionPathPlugin} from 'gsap/MotionPathPlugin'
gsap.registerPlugin(MotionPathPlugin);

const Wrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 5;
`


interface Props {}

function PlayedCards(props: Props) {
    const {} = props
    const { playedCards } = useStore();
    const cardsRef = useRef<HTMLDivElement>([]);

    useEffect(() => {
        if (!cardsRef.current) return
        const lastPlayedCard = cardsRef.current[cardsRef.current.length - 1];
        const lastPlayedCardData = Object.values(playedCards)[Object.values(playedCards).length - 1];
        
        const x = lastPlayedCardData?.x - window.innerWidth / 2;
        const y = lastPlayedCardData?.y - window.innerHeight / 2;


        gsap.set(lastPlayedCard, {
            x: x,
            y: y,
            scale: 1.2,
            zIndex: 99
       })

        gsap.set(lastPlayedCard, {
            css: {
                filter: `drop-shadow(0px 0px 30px rgba(0, 0, 0))`
            }
        })

        gsap.to(lastPlayedCard, {
            duration: 0.7,
            zIndex: 1,
            motionPath: {
              path: [
                { x: x, y: y },          
                { x: x +window.innerHeight / 20, y: y - 100 },
                { x: 0, y: 0, },      
              ],
              curviness: 3,  
            },
            ease: "power1.inOut", 
        })

        gsap.to(lastPlayedCard, {
            rotate: x / 10 * -1,
            scale: 1,
            delay: 0.1
        })
        gsap.to(lastPlayedCard, {
            css: {
                filter: `drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3))`
            }
        })

    },[playedCards])

    return (
        <Wrapper> 
          {Object.values(playedCards).length > 0 && Object.values(playedCards).map((c,i) => <Card key={i} absolute={true} card={playedCards[i].card} color={playedCards[i].type} ref={(el) => cardsRef.current[i] = el}/>) }
          </Wrapper>
    )
}

export default PlayedCards
