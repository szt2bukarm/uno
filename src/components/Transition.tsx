import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'
import useStore from '../store'

const Wrapper = styled.div`
    position: absolute;

    width: 100vw;
    height: 100vh;
    background-color: #000;
    z-index: 99999;
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);

`

function Transition() {
    const {setGameStarted,setTransition,transition} = useStore();
    const wrapper = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (transition) {
            gsap.set(wrapper.current, {
                css: {
                    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)"
                }
            })
            gsap.to(wrapper.current, {
                css:{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                },
                duration: 0.3,
                onComplete: () => {
                    setGameStarted(true);
                }
            })
            gsap.to(wrapper.current, {
                css: {
                    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                },
                duration: 0.3,
                delay: 0.5,
                onComplete: () => {
                    setTransition(false);
                }
            })
        }
    }, [transition])

    return (
        <Wrapper ref={wrapper}>
        </Wrapper>
    )
}

export default Transition
