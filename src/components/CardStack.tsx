import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import useStore from '../store.js'
import cardGenerator from '../utils/Cardgenerator'
import useNextPlayer from '../utils/useNextPlayer'
gsap.registerPlugin(MotionPathPlugin);

const cards = ["0","1","2","3","4","5","6","7","8","9","reverse","block","plus2"]
const types = ["red","blue","green","yellow"]
const common = ["plus4","colorchange"]

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    pointer-events: none;
    z-index: 10;
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
  left: 33%;
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
  border-radius: 20px; 
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

function CardStack() {
    const [pulledCards, setPulledCards] = useState([]);
    const [attackCards, setAttackCards] = useState(0);
    const cardsRef = useRef<HTMLDivElement>([]);
    const frontRef = useRef<HTMLImageElement>([]);
    const backRef = useRef<HTMLImageElement>([]);
    const stackRef = useRef<HTMLDivElement>(null);
    const attackedCardsRef = useRef<HTMLDivElement>([]);
    const { playerNo,setBotPull,botPull,allowCardPull,setAllowCardPull,setAttackedPlayerID,attackedPlayerID, attackAmount,setAttackAmount, editPlayersCards, playersCards,setExpandCards,showPlus4Confirm,currentPlayer,setCurrentPlayer,numberOfPlayer, } = useStore();
    const getNextPlayer = useNextPlayer();

    useEffect(() => {
        gsap.set(stackRef.current, {
            scale: 0.8,
            opacity: 0
        })
        gsap.to(stackRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            delay: 1.2
        })
    }, [])


    const generateCard = () => {
        let randomType = "";
        let randomCard = "";
        const cardTypeChance = Math.floor(Math.random() * 20); 
        if (cardTypeChance < 15) {
            const type = types[Math.floor(Math.random() * types.length)];
            const card = cards[Math.floor(Math.random() * cards.length)];
            randomType = type;
            randomCard = card;
        } else {
            const card = common[Math.floor(Math.random() * common.length)];
            randomType = "common";
            randomCard = card;
        }
        return { randomType, randomCard };
    }

    const pullCard = () => {
        if (!allowCardPull) return;
        if (showPlus4Confirm) return;
        const cardData = generateCard();

        setAllowCardPull(false);
        setExpandCards(true);
        setPulledCards((prevPulledCards) => {
            const newPulledCards = [...prevPulledCards, { type: cardData.randomType, card: cardData.randomCard }];
            AnimatePulledCard(newPulledCards);
            return newPulledCards;
        });    
    }


    const checkPlayersCards = () => {
        const commonIndex = Object.values(playersCards[playerNo]).findIndex(c => c.type == "common");
        const cardIndex = Object.values(playersCards[playerNo]).findIndex(c => c.card == c);
        const typeIndex = Object.values(playersCards[playerNo]).findIndex(c => c.type == c);
        if (commonIndex != -1 || cardIndex != -1 || typeIndex != -1) {
            return;
        } else {
            setCurrentPlayer(getNextPlayer(1));
            setExpandCards(false);
            return;
        }
    }

    const AnimatePulledCard = (newPulledCards) => {
        const stackPosition = stackRef.current.getBoundingClientRect();
        const newCards = {...playersCards[playerNo]};
        newCards[Object.keys(playersCards[playerNo]).length] = newPulledCards[newPulledCards.length - 1];
        setTimeout(() => {
            gsap.to(cardsRef.current[pulledCards.length], {
                scale: 1.2,
                filter: `drop-shadow(0px 0px 50px rgba(0, 0, 0))`,
                motionPath: {
                    path: [
                        { x: 100 , y: -100 },
                        { x: window.innerWidth / 2 - (stackPosition.left + stackPosition.width/2),
                         y: window.innerHeight / 2 - (stackPosition.top + stackPosition.height/2) },        
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
                        editPlayersCards(playerNo, newCards);
                        checkPlayersCards();
                    }
                })
        }, 1);
    }

    const animateAttackedCards = () => {
        const direction = attackedPlayerID == null ? -200 : attackedPlayerID == playerNo ? 200 : -200
        const stackPosition = stackRef.current.getBoundingClientRect();
        gsap.to(attackedCardsRef.current, {
            // scale: 1.5,
            filter: `drop-shadow(0px 0px 50px rgba(0, 0, 0))`,
            motionPath: {
                path: [
                    { x: 100 , y: 0 },
                    { x: window.innerWidth / 2 - (stackPosition.left + stackPosition.width/2),y: direction },
                ],
                curviness: 1,  
                },
                duration: 0.5,
                stagger: 0.1
        })
        gsap.to(attackedCardsRef.current, {
            scale: 1.5,
            opacity: 0,
            duration: 0.2,
            delay: 0.3,
            stagger: 0.1,
            onComplete: () => {
                setAttackCards(0);
                setAttackAmount(0);
                setAttackedPlayerID(null);
            }
        })
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPulledCards([]);
        }, 2500)

        return () => {
            clearTimeout(timeout);
        }
    }, [pulledCards])

    const pullCardsForEnemy = (n: number,playerID: number) => {
        const newCards = {...playersCards[playerID]};
        for (let i = 0; i < n; i++) {
            const cardData = generateCard();
            newCards[Object.keys(playersCards[playerID]).length + i] = { type: cardData.randomType, card: cardData.randomCard };
        }
        editPlayersCards(playerID, newCards);
        setTimeout(() => {
            animateAttackedCards();
        }, 1);
    }

    useEffect(() => {
        if (attackedPlayerID || attackedPlayerID == playerNo) {
            setAttackCards(attackAmount);
            pullCardsForEnemy(attackAmount,attackedPlayerID)
            setTimeout(() => {
                setCurrentPlayer(attackedPlayerID)
            }, 1000);
        }
        
        const timeout = setTimeout(() => {
            setAttackCards(0);
            setAttackAmount(0);
        }, attackAmount * 1500 * 0.2)

        return () => {
            clearTimeout(timeout);
        }
    }, [attackedPlayerID,attackAmount])


    useEffect(() => {
        if (botPull) {
            setTimeout(() => {
                setAttackAmount(1);
                pullCardsForEnemy(1,currentPlayer);
            }, 500);
        }

        const timeout = setTimeout(() => {
            setAttackCards(0);
            setAttackAmount(0);
        }, 1500)

        return () => {
            clearTimeout(timeout);
        }
    },[botPull])

    return <Wrapper>
        <InnerWrapper >
            <CardAbosolute ref={stackRef} onClick={pullCard}>
                <CardInner style={{pointerEvents: showPlus4Confirm ? "none" : "all"}}>
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
            })}
            {Array.from({length: attackAmount}).map((card,i) => {
                return (
                    <CardAbosolute key={i} ref={(el) => attackedCardsRef.current[i] = el}>
                        <CardInner>
                            <Back src={`cards/1.png`} />
                        </CardInner>
                    </CardAbosolute>
                )
            })}
        </InnerWrapper>
    </Wrapper>
}

export default CardStack
