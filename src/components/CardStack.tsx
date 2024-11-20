import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import useStore from '../store.js'
import cardGenerator from '../utils/Cardgenerator'
import useNextPlayer from '../utils/useNextPlayer'
import { socket, cardPulledOnline,attackPulledOnline } from '../socket.js'
gsap.registerPlugin(MotionPathPlugin);

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
    perspective: 100rem;
    transform-style: preserve-3d;
`

const CardAbosolute = styled.div`
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translateY(-50%);
  transition: filter 0.1s, scale 0.1s;

    &:hover {
        cursor: pointer;
        filter: drop-shadow(0px 2rem 4rem rgba(0, 0, 0, 0.8));
    }

    @media (max-width: 900px) {
        left: 20%
    }

    @media (max-width: 600px) {
        left: 10%
    }
`;

const CardInner = styled.div`
  position: relative;
  width: 13.5rem;
  height: 22.5rem;
  /* perspective: 100px; */
  border-radius: 2rem;
  overflow: hidden;
  transition: all 0.1s;
  user-select: none;
  pointer-events: all;
  filter: drop-shadow(0px 0px 1rem rgba(0, 0, 0, 0.38));

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
  border-radius: 2rem; 
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
    const { setBlockedPlayerID,deck,setDeck,lobbyId,onlineMatch,setPlayerPull,drawCard,showColorChanger,playerNo,botPull,allowCardPull,setAllowCardPull,setAttackedPlayerID,attackedPlayerID, attackAmount,setAttackAmount, editPlayersCards, playersCards,showPlus4Confirm,currentPlayer } = useStore();

    useEffect(() => {
        socket.on('blocknotification', (data) => {
            setBlockedPlayerID(data.player);
        })

        socket.on('cardpullednotification', (data) => {
            setAttackAmount(1)
            pullCardsForEnemy(1,data.player);
            editPlayersCards(data.player, data.newCards)
            setDeck(data.newDeck);
        })
        
        socket.on('attacknotification', (data) => {
            console.log(data);
            setAttackedPlayerID(data.player);
            setAttackAmount(data.amount);
            pullCardsForEnemy(data.amount,data.player);
            setDeck(data.newDeck);
            editPlayersCards(data.player, data.newCards)
        })
    })

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

    const pullCard = () => {
        if (currentPlayer != playerNo) return;
        if (!allowCardPull) return;
        const cardData = drawCard();

        setAllowCardPull(false);
        setPulledCards((prevPulledCards) => {
            const newPulledCards = [...prevPulledCards, { type: cardData.type, card: cardData.card }];
            AnimatePulledCard(newPulledCards);
            return newPulledCards;
        });    
    }

    const AnimatePulledCard = (newPulledCards) => {
        const stackPosition = stackRef.current.getBoundingClientRect();
        const newCards = {...playersCards[playerNo]};
        newCards[Object.keys(playersCards[playerNo]).length] = newPulledCards[newPulledCards.length - 1];
        setTimeout(() => {
            if (onlineMatch) cardPulledOnline(lobbyId,newCards,deck.slice(1),playerNo);
        }, 1);
        setTimeout(() => {
            gsap.to(cardsRef.current[pulledCards.length], {
                scale: 1.2,
                filter: `drop-shadow(0px 0px 5rem rgba(0, 0, 0))`,
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
                        setPlayerPull(true);
                    }
                })
        }, 1);
    }

    const animateAttackedCards = () => {
        const direction = attackedPlayerID == -1 ? -200 : attackedPlayerID == playerNo ? 200 : -200
        const stackPosition = stackRef.current.getBoundingClientRect();
        gsap.to(attackedCardsRef.current, {
            filter: `drop-shadow(0px 0px 5rem rgba(0, 0, 0))`,
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
                setTimeout(() => {
                    setAttackAmount(0);
                    setAttackedPlayerID(-1);
                }, 500);
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

        if (!onlineMatch){
            for (let i = 0; i < n; i++) {
                const cardData = drawCard();
                newCards[Object.keys(playersCards[playerID]).length + i] = { type: cardData.type, card: cardData.card };
            }    
            editPlayersCards(playerID, newCards);
        }

        setTimeout(() => {
            animateAttackedCards();
        }, 1);
    }

    useEffect(() => {
        if (attackedPlayerID != -1) {
            pullCardsForEnemy(attackAmount,attackedPlayerID);
        }
    }, [attackedPlayerID])

    useEffect(() => {
        if (botPull) {
            setTimeout(() => {
                setAttackAmount(1);
                pullCardsForEnemy(1,currentPlayer);
            }, 500);
        }

        const timeout = setTimeout(() => {
            setAttackAmount(0);
        }, 1500)

        return () => {
            clearTimeout(timeout);
        }
    },[botPull])

    return <Wrapper style={{zIndex: showColorChanger ? 1 : 10}}>
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
