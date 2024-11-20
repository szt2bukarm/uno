import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import Mainpage from './components/MenuPages/Mainpage';
import useStore from './store.js';
import Localpage from './components/MenuPages/Localpage.js';
import Onlinepage from './components/MenuPages/Onlinepage.js';
import Lobbypage from './components/MenuPages/Lobbypage.js';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: radial-gradient(rgb(56, 14, 14), rgb(0, 0, 0));
    overflow: hidden;
`;

const CardContainer = styled.div`
    perspective: 1000px; 
    display: inline-block;
    position: absolute;
`;

const Card = styled.img`
    width: 135px;
    height: 225px;
    border-radius: 20px;
    user-select: none;
    transform-origin: center;
    transform-style: preserve-3d;
`;

const Card1 = styled(Card)`
    transform: rotateY(0deg) rotateX(50deg) rotateZ(30deg) scale(2);
    filter: blur(5px);
    opacity: 0.2;
`
const Card2 = styled(Card)`
    transform: rotateY(0deg) rotateX(30deg) rotateZ(-30deg) scale(1.8);
    filter: blur(2px);
    opacity: 0.3;
`
const Card3 = styled(Card)`
    transform: rotateY(210deg) rotateX(320deg) rotateZ(10deg) scale(2.1);
    filter: blur(3px);
    opacity: 0.3;
`
const Card4 = styled(Card)`
    transform: rotateY(210deg) rotateX(-40deg) rotateZ(110deg) scale(1.9);
    filter: blur(3px);
    opacity: 0.3;
`
const Card5 = styled(Card)`
    transform: rotateY(-20deg) rotateX(30deg) rotateZ(20deg) scale(1.4);
    filter: blur(3px);
    opacity: 0.3;
`
const Card6 = styled(Card)`
    transform: rotateY(40deg) rotateX(20deg) rotateZ(0deg) scale(1.4);
    filter: blur(2px);
    opacity: 0.3;
`

const MenuWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: 900px) {
        scale: 0.9 !important
    }
`

const MenuItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 400px;
    height: 400px;
    background-color: #fff;
    box-shadow: inset 0px 0px 20px #2c040471;
    filter: drop-shadow(0px 0px 100px #ffffff41);
    border-radius: 15px;
    border: 5px solid #fff;
    opacity: 0;
`

const Logo = styled.img`
    width: 500px;
    /* width: 30rem; */
    filter: drop-shadow(0px 0px 100px #ffffff41);
    rotate: 10deg;
`


function Menu() {
    const {currentMenuPage} = useStore();
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuItemRef = useRef<HTMLDivElement>(null);
    const [allowMouseEvent, setAllowMouseEvent] = useState(true);

    useEffect(() => {
            gsap.set(logoRef.current, {
                scale: 0,
                opacity: 0,
            })
            gsap.set(menuRef.current, {
                y: 200
            })
            gsap.to(logoRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                delay:0.5
            })
            gsap.to(logoRef.current, {
                width: '300px',
                duration: 0.2,
                delay: 1
            })
            gsap.to(menuRef.current, {
                y: 0,
                duration: 0.2,
                delay: 1
            })
            gsap.to(menuItemRef.current, {
                opacity: 1,
                duration: 0.2,
                delay: 1
            })
        gsap.set(cardsRef.current, {
            y: 100,
            opacity: 0
        })
        gsap.set(wrapperRef.current, {
            opacity: 0,
        })
        gsap.to(wrapperRef.current, {
            opacity: 1,
            delay: 0.5,
            duration: 0.5
        })
        gsap.to(cardsRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.2,
            delay: 1,
            onComplete: () => {
                setAllowMouseEvent(true);
            }
        })
    },[])

    const moveCards = (e: MouseEvent) => {
        if (!allowMouseEvent) return;
        gsap.to(cardsRef.current, {
            x: (window.innerWidth / 2 - e.clientX) / 20,
            y: (window.innerHeight / 2 - e.clientY) / 20,
            stagger: 0.05
        })
    }


    return (
        <Wrapper onMouseMove={(e) => moveCards(e)} ref={wrapperRef}>
            <CardContainer style={{ top: '-10%', left: '90%' }} ref={el => cardsRef.current[0] = el!}>
                <Card1 src="/cards/red/0.png"/>
            </CardContainer>
            <CardContainer style={{ top: '0%', left: '0%' }} ref={el => cardsRef.current[1] = el!}>
                <Card2 src="/cards/green/8.png"/>
            </CardContainer>
            <CardContainer style={{ top: '80%', left: '95%' }} ref={el => cardsRef.current[2] = el!}>
                <Card3 src="/cards/blue/plus2.png"/>
            </CardContainer>
            <CardContainer style={{ top: '80%', left: '5%' }} ref={el => cardsRef.current[3] = el!}>
                <Card4 src="/cards/common/colorchange.png"/>
            </CardContainer>
            <CardContainer style={{ top: '42%', left: '5%' }} ref={el => cardsRef.current[4] = el!}>
                <Card5 src="/cards/yellow/reverse.png"/>
            </CardContainer>
            <CardContainer style={{ top: '35%', left: '85%' }} ref={el => cardsRef.current[5] = el!}>
                <Card6 src="/cards/green/2.png"/>
            </CardContainer>
            <MenuWrapper ref={menuRef}>
                <Logo src='public/logo.png' ref={logoRef} />
                <MenuItem ref={menuItemRef}>
                    {currentMenuPage == "main" && <Mainpage />}
                    {currentMenuPage == "local" && <Localpage />}
                    {currentMenuPage == "online" && <Onlinepage />}
                    {currentMenuPage == "lobby" && <Lobbypage />}
                </MenuItem>
            </MenuWrapper>
        </Wrapper>
    );
}

export default Menu;
