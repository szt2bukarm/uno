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
    pointer-events: all;
    z-index: 9;
`

const InnerWrapper = styled.div`
    display: flex;
    gap: 10px;
    transform: translateY(200px);
`
const Button = styled.button`
    padding: 10px 20px;
    border-radius: 30px;
    border: none;
    font-size: 20px;
    background-color: #ffffff;
    transition: 0.2s;
    box-shadow: 0 0 50px #000;

    &:hover {
        cursor: pointer;
        background-color: #000;
        color: #ffffff;
    }
`


interface Props {
    onClick: () => void
}

function Plus4Confirm({onClick}: Props) {
    const { setShowPlus4Confirm,setShowColorChanger } = useStore();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.set(wrapperRef.current, {
            opacity: 0
        })
        gsap.to(wrapperRef.current, {
            opacity: 1,
            duration: 0.3
        })
    },[])

    const openColorChanger = () => {
        setShowColorChanger(true);
        setShowPlus4Confirm(false);
    }

    return (
        <Wrapper ref={wrapperRef}>
            <InnerWrapper>
                <Button onClick={onClick}>Place another +4 card</Button>
                <Button onClick={openColorChanger}>Change color</Button>
            </InnerWrapper>
        </Wrapper>
    )
}

export default Plus4Confirm
