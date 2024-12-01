import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'
import useStore from '../store.js'

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    /* background-color: #00000030; */
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    z-index: 999;
`

const InnerWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`



const Button = styled.button`
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 2rem;
    border-radius: 3rem;
    border: none;
    font-size: 2rem;
    background-color: #ffffff;
    transition: 0.2s;
    box-shadow: 0 0 5rem #000;
    pointer-events: auto;

    &:hover {
        cursor: pointer;
        background-color: #000;
        color: #ffffff;
    }
`


interface props {
    onClick: () => void
}

function EndRound({ onClick }: props) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.set(wrapperRef.current, {
            opacity: 0
        })
        gsap.to(wrapperRef.current, {
            opacity: 1,
            duration: 0.1
        })
    },[])

    const onLeave = () => {
        gsap.to(wrapperRef.current, {
            opacity: 0,
            duration: 0.1,
            onComplete: () => onClick()
        })
    }

    return (
        <Wrapper ref={wrapperRef}>
            <InnerWrapper>
                <Button onClick={onLeave}>EndRound</Button>
            </InnerWrapper>
        </Wrapper>
    )
}

export default EndRound
