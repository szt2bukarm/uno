import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'
import useStore from '../store'

const Wrapper = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    z-index: 99999;
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
`

const Text = styled.p`
    font-size: 10vw;
    font-weight: 600;
    color: #fff;
    text-align: center;
    text-shadow: 0 0 10rem #fff;
    opacity: 0;
    scale: 0.4;
`    

function EndScreen() {
    const {setGameStarted,gameEnded,gameEndedWinner} = useStore();
    const wrapper = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (gameEnded) {
            gsap.set(wrapper.current, {
                css: {
                    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)"
                }
            })
            gsap.set(textRef.current, {
                scale: 0,
                opacity: 0
            })
            gsap.to(textRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                delay: 0.5
            })

            gsap.to(textRef.current, {
                scale: 0.4,
                opacity: 0,
                duration: 0.3,
                delay: 4
            })

            gsap.to(wrapper.current, {
                css:{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                },
                duration: 0.3,
                onComplete: () => {
                    setGameStarted(false);
                }
            })

            gsap.to(wrapper.current, {
                delay: 5,
                onComplete: () => {
                    location.reload();
                }
            })
        }
    }, [gameEnded])

    return (
        <Wrapper ref={wrapper}>
            <Text ref={textRef}>{gameEndedWinner} WON!</Text>
        </Wrapper>
    )
}

export default EndScreen
