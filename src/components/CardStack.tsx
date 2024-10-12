import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import useStore from '../store.js'
gsap.registerPlugin(MotionPathPlugin);

const cards = ["0","1","2","3","4","5","6","7","8","9","reverse","block"]
const types = ["red","blue","green","yellow"]


const Wrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    pointer-events: none;
    z-index: 5;
`

const InnerWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    perspective: 1000px;
    transform-style: preserve-3d;
`

const CardAbosolute = styled.div`
  position: absolute;
  top: 50%;
  left: 25%;
  transform: translateY( -50%);
  transition: filter 0.1s, scale 0.1s;

    &:hover {
        cursor: pointer;
        filter: drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.8));
    }
`;

const CardInner = styled.div`
  position: relative;
  width: 135px;
  height: 225px;
  /* perspective: 100px; */
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.1s;
  user-select: none;
  pointer-events: all;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.38));

  &:hover {
    scale: 1.1;
  }
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
`;

const Back = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(0deg);
`;



interface Props {}

function CardStack(props: Props) {
    const {} = props
    const [pulledCards, setPulledCards] = useState([]);
    const cardsRef = useRef<HTMLDivElement>([]);
    const frontRef = useRef<HTMLImageElement>([]);
    const backRef = useRef<HTMLImageElement>([]);
    const stackRef = useRef<HTMLDivElement>(null);
    const { setPlayersCards, playersCards,setExpandCards } = useStore();

    const pullCard = (e: React.MouseEvent) => {
        const randomColor = types[Math.floor(Math.random() * types.length)];
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        setExpandCards(true);
        setPulledCards((prevPulledCards) => {
            const newPulledCards = [...prevPulledCards, { type: randomColor, card: randomCard }];
            AnimatePulledCard(newPulledCards);
            return newPulledCards;
        });    
    }

    const AnimatePulledCard = (newPulledCards) => {
        const stackPosition = stackRef.current.getBoundingClientRect();
        playersCards[Object.keys(playersCards).length] = newPulledCards[newPulledCards.length - 1];
        setTimeout(() => {
            gsap.to(cardsRef.current[pulledCards.length], {
                scale: 1.2,
                filter: `drop-shadow(0px 0px 50px rgba(0, 0, 0))`,
                motionPath: {
                    path: [
                        { x: 100 , y: -100 },
                        { x: window.innerWidth / 2 - (stackPosition.left + stackPosition.width/2), y: window.innerHeight / 2 - (stackPosition.top + stackPosition.height/2 ) },           // Starting point (current position)
                    ],
                    curviness: 1,  
                    },
                    duration: 0.3,

            })

                gsap.to(frontRef.current[pulledCards.length], {
                    rotateY: '0deg',delay: 0.5,duration: 0.2
                })
                gsap.to(backRef.current[pulledCards.length], {
                    rotateY: '180deg',delay: 0.5,duration: 0.2
                })

                gsap.to(cardsRef.current[pulledCards.length], {
                    scale: 0.8,
                    blur: 5,
                    y: 100,
                    opacity: 0,
                    duration: 0.2,
                    delay: 1.5,
                    onComplete: () => {
                        console.log(pulledCards);
                        setPlayersCards(playersCards);
                        setExpandCards(false);
                    }
                })
        }, 1);
    }

    return <Wrapper>
        <InnerWrapper>
            <CardAbosolute ref={stackRef} onClick={(e) => pullCard(e)}>
                <CardInner>
                    <Back src={`cards/1.png`} />
                </CardInner>
            </CardAbosolute>
            {pulledCards.map((card,i) => {
                return (
                    <CardAbosolute key={i} ref={(el) => cardsRef.current[i] = el}>
                        <CardInner>
                            <Front ref={(el) => frontRef.current[i] = el} src={`cards/${card.type}/${card.card}.png`} />
                            <Back ref={(el) => backRef.current[i] = el} src={`cards/1.png`} />
                        </CardInner>
                    </CardAbosolute>
                )
            })
        }
        </InnerWrapper>
    </Wrapper>
}

export default CardStack
