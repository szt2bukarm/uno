import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Card from './Card';
import useStore from '../store.js';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

const Wrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
`;

function PlayedCards() {
    const { playedCards } = useStore();
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const [newMatch, setNewMatch] = useState(true);

    useEffect(() => {      
        if (newMatch) {
            setNewMatch(false);
            gsap.set(cardsRef.current, {
                y: 100,
                x: 0,
                opacity: 0,
            });
            gsap.to(cardsRef.current, {
                scale: 1,
                y: 0,
                opacity: 1,
                duration: 0.3,
                delay: 1.2,
            });
        }

        if (!newMatch) {
            const lastPlayedCard = cardsRef.current[cardsRef.current.length - 1];
            const lastPlayedCardData = Object.values(playedCards)[Object.values(playedCards).length - 1];
            const x = lastPlayedCardData?.x - window.innerWidth / 2;
            const y = lastPlayedCardData?.y - window.innerHeight / 2;
            const rotation = lastPlayedCardData?.rotation
            console.log(x);

            gsap.set(lastPlayedCard, {
                x: x,
                y: y,
                scale: 1.2,
                zIndex: 9,
            });

            gsap.set(lastPlayedCard, {
                css: {
                    filter: `drop-shadow(0px 0px 30px rgba(0, 0, 0))`,
                },
            });

            gsap.to(lastPlayedCard, {
                duration: 0.7,
                zIndex: 1,
                motionPath: {
                    path: [
                        { x: x, y: y },
                        { x: x + window.innerHeight / 20, y: y - 100 },
                        { x: 0, y: 0 },
                    ],
                    curviness: 3,
                },
                ease: 'power1.inOut',
            });

            gsap.to(lastPlayedCard, {
                rotate: rotation,
                scale: 1,
                delay: 0.1,
            });
            gsap.to(lastPlayedCard, {
                css: {
                    filter: `drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3))`,
                },
            });
        }
    }, [playedCards]);


    return (
        <Wrapper>
            {Object.values(playedCards).length > 0 &&
                Object.values(playedCards).map((c, i) => (
                    <Card
                        key={`${c.type} ${c.card} ${c.rotation}`}
                        absolute={true}
                        allowHover={false}
                        type={c.type}
                        card={c.card}
                        ref={(el) => (cardsRef.current[i] = el)}
                    />
                ))}
        </Wrapper>
    );
}

export default PlayedCards;
