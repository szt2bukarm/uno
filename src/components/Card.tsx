import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'

const Wrapper = styled.div`
    position: relative;
    width: 165px;
    height: 265px;
    /* perspective: 100px; */
    border-radius: 20px;
    overflow: hidden;
    transition: all .05s;
    /* &:hover .front{
        transform: rotateY(180deg);
    }

    &:hover .back{
        transform: rotateY(360deg);
    } */
`

const Shadow = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 2;
`
    

const Front = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* backface-visibility: hidden; */
    backface-visibility: hidden;
    border-radius: 20px; /* Adding border-radius to match the parent */
    transform: rotateY(180deg);
`

const Back = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
        backface-visibility: hidden;
    transform: rotateY(0deg);
`


interface CardProps {
    card: string;
    color: string;
}

// Card component using the props
function Card({ card, color }: CardProps) {
    const cardRef = useRef();
    const shadowRef = useRef();
    const frontRef = useRef();
    const backRef = useRef();

    useEffect(() => {
        gsap.to(frontRef.current, {
            rotateY: '0deg',
            delay: 0.5
        })

        gsap.to(backRef.current, {
            rotateY: '180deg',
            delay: 0.5
        })
    },[])

    const tiltHandler = (e: any) => {
        const wrapper = e.currentTarget.getBoundingClientRect();
    
        const x = (e.clientX - (wrapper.left + wrapper.width / 2)) / 6;
        const y = (e.clientY - (wrapper.top + wrapper.height / 2)) / 20;



        gsap.to(cardRef.current, {
            rotateX: -y,
            rotateY: x,
            transformPerspective: 600, 
        })
        gsap.to(cardRef.current,{
            css: {
                boxShadow: `${-x/2}px ${-y/2}px 20px rgba(0,0,0,0.7)`
            },
        })
        gsap.to(shadowRef.current, {
            css: {
                boxShadow: `inset ${-x/2}px ${-y/2}px 20px rgba(0,0,0,0.3)`
            }
        })
    };

    const onLeave = () => {
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
        })
        gsap.to(cardRef.current,{
            css: {
                boxShadow: `0px 0px 20px rgba(0,0,0,0.05)`
            },
        })
        gsap.to(shadowRef.current, {
            css: {
                boxShadow: `inset 0px 0px 0px rgba(0,0,0,0.1)`
            }
        })
    }


    return (
        <Wrapper ref={cardRef} onMouseMove={(e: any) => tiltHandler(e)} onMouseLeave={onLeave}>
            <Shadow ref={shadowRef} />
            <Front ref={frontRef} src={`cards/${color}/${card}.png`} className="front" />
            <Back ref={backRef} src={`cards/1.png`} className="back" />
        </Wrapper>
    )
}

export default Card
