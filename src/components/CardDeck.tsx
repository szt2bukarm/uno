import React, { useEffect, useRef, useState } from 'react'
import Card from './Card'
import gsap from 'gsap'
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import styled from 'styled-components'
import useStore from '../store.js'
import useNextPlayer from '../utils/useNextPlayer.js'
import ColorSwitcher from './ColorSwitcher.js'
import EndRound from './EndRound.js'
import {socket, cardPlayedOnline,changePlayerOnline,attackOnline, blockOnline, lastCardOnline} from '../socket.js'
gsap.registerPlugin(MotionPathPlugin);

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9;
  pointer-events: none;
  transition: opacity .1s;
`

const InnerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const CardWrapper = styled.div`
    /* width: 100vw;
    height: 100vh; */
    position: absolute;
    bottom: 2rem;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    z-index: 2;
`

const LeftArrow = styled(FaArrowCircleLeft)`
    position: absolute;
    bottom: 26rem;
    left: 2rem;
    font-size: 5rem;
    color: #fff;
    cursor: pointer;
    transition: all .2s;

    &:hover{
        transform: scale(0.9);
        opacity: 0.8;
    }
`

const RightArrow = styled(FaArrowCircleRight)`
    position: absolute;
    bottom: 26rem;
    right: 2rem;
    font-size: 5rem;
    color: #fff;
    cursor: pointer;
    transition: all .2s;

    &:hover{
        transform: scale(0.9);
        opacity: 0.8;
    }
`

function CardDeck() {
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [cardPlayed,setCardPlayed] = useState(false)
    const [showEndRoundColorMatch,setShowEndRoundColorMatch] = useState(false)
    const [showEndRoundAttack,setShowEndRoundAttack] = useState(false)
    const [showEndRoundPullMatch,setShowEndRoundPullMatch] = useState(false)
    const [localAttackAmount,setLocalAttackAmount] = useState(0);
    const { setGameEndedWinner,blockActions,setBlockActions,playerName,lastCardAttack,setLastCardAttack,setLastCardName,setLastCardPlayer,drawCard,onlineMatch,lobbyId,playerPull,setPlayerPull,setRoundOverFlag,roundOverFlag,showColorChanger,setBlockedPlayerID,blockedPlayerID,setBasicColorChanger,setAllowCardPull,playerNo,setAttackedPlayerID,setAttackAmount,editPlayersCards,reversed,setReversed,setPlayedCards,playersCards,playedCards,expandCards,setExpandCards,setShowColorChanger,currentPlayer,setCurrentPlayer } = useStore();
    const [transform, setTransform] = useState(0);
    const newMatch = useRef(true);
    const [showTransform, setShowTransform] = useState(false);
    const getNextPlayer = useNextPlayer();
    
      useEffect(() => {
        cardsRef.current = cardsRef.current.filter((card) => card !== null);
        if (newMatch.current) {
          gsap.set(cardsRef.current, {
            y: window.innerHeight / 2,
          })
          gsap.to(cardsRef.current, {
            x: 0,
            y: -300,
            stagger: 0.03,
          })
        }
        setTimeout(() => {
          newMatch.current = false;
          if (!expandCards) {
            cardsRef.current.forEach((c, i) => {
              const base = Math.ceil(0 - cardsRef.current.length / 2);
              gsap.to(c, {
                rotate: `${(base + i) * 5}deg`,
                y: `${Math.abs(base + i) * 2 + 10}rem`,
                x: `${(base + i) * -5 + (cardsRef.current.length % 2 == 0 ? -3 : 0)}rem`,
                duration: 0.5,
                ease: 'circ.inOut',
              });
            });
            gsap.to(cardsRef.current, {
              css: {
                filter: `drop-shadow(0px 0px 3rem rgb(0, 0, 0))`,
              },
              duration: 0.5,
            })
          } else {
              gsap.to(cardsRef.current, {
                rotate: 0,
                y: 0,
                x: 0,
                duration: 0.5,
                stagger: 0.02,
                ease: 'circ.inOut'
              });
              gsap.to(cardsRef.current, {
                css: {
                  filter: `drop-shadow(0px 0px 1rem rgba(0, 0, 0, 0.38))`,
                },
                duration: 0.5,
              })
    
          }  
        }, newMatch.current ? 800 : 0);
      }, [expandCards, playersCards]);


      useEffect(() => {
        socket.on('reversenotification', (data) => {
          setReversed(data.reversed)
        })
      },[])

      // check block
      useEffect(() => {
        if (+blockedPlayerID == +playerNo) {
          gsap.to(cardsRef.current, {
            filter: `saturate(0)`,
            duration: 0.5,
            delay: 0.5,
          })
          gsap.to(cardsRef.current, {
            filter: `saturate(1)`,
            duration: 0.5,
            delay: 2,
          })
          setTimeout(() => {
              setCurrentPlayer(getNextPlayer());
              setBlockedPlayerID(-1);
            }, 2500);
        }
      }, [blockedPlayerID,currentPlayer,cardsRef])

      const changeTransition = (position: string) => {
        const transitionAmount = (window.innerWidth * 0.75) * (position === 'left' ? 1 : -1);
        
        // Update the transform incrementally
        setTransform((prevTransform) => {
          const newTransform = prevTransform + transitionAmount;
      
          gsap.to(position === 'left' ? cardsRef.current.reverse() : cardsRef.current, {
            x: newTransform,
            ease: 'circ.inOut',
            duration: 0.3,
            stagger: 0.01
          });
      
          return newTransform; // Update the state with the new value
        });
      };
      
      // player's turn
      useEffect(() => {
        setTimeout(() => {
          if (currentPlayer == playerNo) {
            setExpandCards(true);
            setLocalAttackAmount(0);
            return
          }
        }, newMatch.current ? 1300 : 0);
      },[currentPlayer])


      const EndAttackRound = () => {
        setShowEndRoundAttack(false);
        setAttackAmount(localAttackAmount);
        setAttackedPlayerID(getNextPlayer());
        setExpandCards(false);
        setRoundOverFlag(true);
        if (onlineMatch) {
          const nextPlayer = getNextPlayer();
          const newCards = {...playersCards[nextPlayer]};
          for (let i = 0; i < localAttackAmount; i++) {
            const cardData = drawCard();
            newCards[Object.keys(playersCards[nextPlayer]).length + i] = { type: cardData.type, card: cardData.card };
        }    
        attackOnline(lobbyId,newCards,nextPlayer,localAttackAmount)
      }
    }

      const EndRoundColorMatch = () => {
        setShowEndRoundColorMatch(false);
        setExpandCards(false);
        setRoundOverFlag(true);
      }

      const checkCardAvailability = () => {
        const cards = Object.values(playersCards[playerNo]);
        const lastCard = playedCards[Object.keys(playedCards).length - 1];
        if (!playerPull) {
          setShowEndRoundColorMatch(true);
          setShowEndRoundPullMatch(false);
          return cards.some((c) => c.card === lastCard.card);
        } else if (playerPull) {
          setShowEndRoundPullMatch(true);
          return cards.some((c) => c.type === lastCard.type || c.card === lastCard.card || c.type === "common");
        }
      }

      const endRound = () => {
        setRoundOverFlag(true);
        setShowEndRoundColorMatch(false);
        setShowEndRoundPullMatch(false);
        setShowEndRoundAttack(false);
        setPlayerPull(false);
        setTimeout(() => {
          setExpandCards(false);
        }, 200);
      }

      const handleReverse = () => {
        setReversed(!reversed);
        if (onlineMatch) socket.emit('reverse', lobbyId, reversed);
        endRound();
        return true;
      }

      const handlePlus2 = () => {
        const numberOfCards = Object.values(playersCards[playerNo]).filter(c => c.card == "plus2").length;
        setShowEndRoundColorMatch(false);
        setShowEndRoundPullMatch(false);
        if (numberOfCards == 1) {
          if (localAttackAmount != 0) {
            setAttackedPlayerID(getNextPlayer());
            setAttackAmount(localAttackAmount + 2);
            endRound();
            if (onlineMatch) {
              const nextPlayer = getNextPlayer();
              const newCards = {...playersCards[nextPlayer]};
              for (let i = 0; i < localAttackAmount + 2; i++) {
                const cardData = drawCard();
                newCards[Object.keys(playersCards[nextPlayer]).length + i] = { type: cardData.type, card: cardData.card };
            }    
            attackOnline(lobbyId,newCards,nextPlayer,localAttackAmount)
            }
            return true;
            }
            if (onlineMatch) {
              const nextPlayer = getNextPlayer();
              const newCards = {...playersCards[nextPlayer]};
              for (let i = 0; i < 2; i++) {
                const cardData = drawCard();
                newCards[Object.keys(playersCards[nextPlayer]).length + i] = { type: cardData.type, card: cardData.card };
            }    
            attackOnline(lobbyId,newCards,nextPlayer,localAttackAmount)
            }
            setAttackAmount(2);
            setAttackedPlayerID(getNextPlayer());
            endRound();
            return true;
        } else {
          if (localAttackAmount == 0) {
            setLocalAttackAmount(2)
          } else {
            setLocalAttackAmount(localAttackAmount + 2);
          }
          setShowEndRoundAttack(true);
        }
        return true;
      }

      const handlePlus4 = () => {
        setBasicColorChanger(false);
        setShowColorChanger(true);
        setShowEndRoundColorMatch(false);
        setShowEndRoundPullMatch(false);
        return true;
      }

      const handleBlock = () => {
        setBlockedPlayerID(getNextPlayer());
        if (onlineMatch) blockOnline(lobbyId,getNextPlayer());
        endRound();
        return true;
      }

      const cardChecker = (type,card) => {
        const lastCard = playedCards[Object.keys(playedCards).length - 1];


        if (showEndRoundPullMatch && card == "colorchange") {
          setBasicColorChanger(true);
          setShowColorChanger(true);
          setShowEndRoundColorMatch(false);
          setShowEndRoundPullMatch(false);
          return true;
        }
        
        if (showEndRoundPullMatch && card == "plus4") {
          return handlePlus4();
        }

        if (showEndRoundPullMatch && card == "block" && lastCard.card == "block") {
          return handleBlock();
        }
        
        if (showEndRoundPullMatch && card == "reverse" && lastCard.card == "reverse") {
          return handleReverse();
        }

        if (showEndRoundPullMatch && card == lastCard?.card) return true;

        if (card == "block" && (lastCard?.card == "block" || lastCard?.type == type) && !showEndRoundAttack && !showEndRoundPullMatch && !showEndRoundColorMatch) {
          return handleBlock();
        }

        if (card == "colorchange" && !showEndRoundAttack && !showEndRoundPullMatch && !showEndRoundColorMatch) {
          setBasicColorChanger(true);
          setShowColorChanger(true);
          setShowEndRoundColorMatch(false);
          setShowEndRoundPullMatch(false);
          return true;
        }

        if (card == "reverse" && (lastCard?.card == "reverse" || lastCard?.type == type) && !showEndRoundAttack && !showEndRoundPullMatch && !showEndRoundColorMatch) {
          return handleReverse();
        }

        if (card == "plus4" && !showEndRoundAttack && !showEndRoundPullMatch && !showEndRoundColorMatch) {
          return handlePlus4();
        }
        
        if (type != lastCard.type && showEndRoundPullMatch) return false;
        if (card != lastCard.card && showEndRoundColorMatch) return false;
        
        if (card == "plus2" && (lastCard?.card == "plus2" || lastCard?.type == type)) {
          return handlePlus2();
        }
         
        if (localAttackAmount != 0 && lastCard?.card == "plus2" && card != "plus2") {
          return false;
        }

        if (lastCard?.type === type) {
          return true;
        };
        if (lastCard?.card === card) {
          return true;
        }
        if (type == "common") {
          return true;
        }
        return false
      }

      useEffect(() => {
        if (roundOverFlag && currentPlayer == playerNo && setAttackedPlayerID != playerNo) {
          if (Object.values(playersCards[playerNo]).length == 1) return;
          setPlayerPull(false);
          setCardPlayed(false);
          if (!onlineMatch) setCurrentPlayer(getNextPlayer());
          if (onlineMatch) changePlayerOnline(lobbyId,getNextPlayer());
        }
      },[roundOverFlag])
    
      const clickHandler = (e: React.MouseEvent) => {
        if (currentPlayer != playerNo || playerNo == blockedPlayerID || blockActions || lastCardAttack) return;
        const target = e.currentTarget;
        const index = cardsRef.current.findIndex(c => c === target);
        const check = cardChecker(Object.values(playersCards[playerNo])[index]?.type, Object.values(playersCards[playerNo])[index]?.card);
        if (!check) {
          gsap.to(target, {
            motionPath: {
              path: [ { x: 0},{ x: -2,},{ x: 2},{ x: -2},{ x: 2,},{ x: 0}, ]},
              duration: 0.5,
            }
          )
          return;
        };
        setCardPlayed(true);
        const clientX = e.clientX;
        const clientY = e.clientY;
        
        const rect = target.getBoundingClientRect();
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const moveX = clientX - centerX;
        const moveY = clientY - centerY;

        gsap.to(target, {
          css: {
            filter: `drop-shadow(0px 0px 3rem rgb(0, 0, 0))`,
          },
        })

        gsap.to(target, {
          x: moveX,
          y: moveY,
          scale: 1.2,
          duration: 0.1,
            onComplete: () => {
              cardsRef.current.filter((c, i) => c !== null);
              const card = Object.values(playersCards[playerNo])[index];
              setPlayerPull(false);
              setTransform(0);
              setPlayedCards({
                type: card?.type,
                card: card?.card,
                x: clientX,
                y: clientY,
              });

              gsap.set(target, {
                x: 0,
                y: 0,
                scale: 1,
              })
              gsap.set(target, {
                css: {
                  filter: `drop-shadow(0px 0px 1rem rgba(0, 0, 0, 0.38))`,
                }
              })
              
              const newCards = Object.values(playersCards[playerNo]).filter((c, i) => c !== Object.values(playersCards[playerNo])[index]);
              editPlayersCards(playerNo,newCards);

              if (onlineMatch) cardPlayedOnline(lobbyId,card?.type,card?.card,index,newCards,playerNo)
            }
        });
      };

      useEffect(() => {
        const handleResize = () => {
          if (wrapperRef.current) {
            const deckWidth = cardsRef.current.length * cardsRef.current[0].offsetWidth;
            console.log(deckWidth);
            if (deckWidth > window.innerWidth) {
              setShowTransform(true);
            } else {
              setTransform(0);
              gsap.to(cardsRef.current, {
                x: 0,
              })
              setShowTransform(false);
            }
          }
        };
      
        // Initial check
        handleResize();
      
        // Add event listener
        window.addEventListener("resize", handleResize);
      
        // Cleanup listener on unmount
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);
      

      // check if a card is available, or can be played on top of another
      useEffect(() => {
        if (Object.values(playersCards[playerNo]).length == 1) {
            if (onlineMatch) lastCardOnline(lobbyId,playerName,playerNo);
            setLastCardAttack(true);
            setLastCardPlayer(playerNo);
            setLastCardName(playerName ? playerName : "You");  
        }

        const lastCard = playedCards[Object.keys(playedCards).length - 1];
        if ((lastCard?.card == "plus4" || (lastCard?.card == "colorchange" && lastCard?.type == "common") || lastCard.card == "plus2" || lastCard.card == "block") && !playerPull) return;
        if (!cardPlayed && !playerPull) return;
              
        const cardAvailable = checkCardAvailability();
        if (!cardAvailable) {
          endRound()
          return;
        }
      },[Object.values(playersCards[playerNo]).length])

      useEffect(() => {
        if (Object.values(playersCards[playerNo]).length == 0) {
          setGameEndedWinner(playerName ? playerName : "YOU");
        }
      }, [playersCards])


      // player blocked. Prevent player from placing cards
      useEffect(() => {
        if (blockedPlayerID == playerNo) {
          setBlockActions(true);
        }
      }, [blockedPlayerID])

      // player blocked, unblock after 3.5 seconds
      useEffect(() => {
        setTimeout(() => {
          setBlockActions(false);
          if (blockedPlayerID == playerNo) setExpandCards(false);
        }, 3500);
      }, [blockActions])


      // reset state for current player to begin round
      useEffect(() => {
        if (currentPlayer == playerNo) {
          setAllowCardPull(true);
          setShowEndRoundAttack(false);
          setShowEndRoundColorMatch(false);
          setShowEndRoundPullMatch(false);
          setRoundOverFlag(false);
        }
      },[currentPlayer])
        
    return (
      <Wrapper style={{opacity: currentPlayer == playerNo ? 1 : 0.5, pointerEvents: (showColorChanger || lastCardAttack) ? "none" : "auto"}} ref={wrapperRef}>
          <InnerWrapper>
            {showTransform && currentPlayer == playerNo && <>
              <LeftArrow onClick={() => changeTransition('left')}/>
            <RightArrow onClick={() => changeTransition('right')}/>
            </>}
            <CardWrapper>
              {Object.values(playersCards).length > 0 && Object.values(playersCards[playerNo]).map((c,i) => <Card onClick={(e: React.MouseEvent) => clickHandler(e)} key={i} type={c.type} card={c.card} ref={(el) => cardsRef.current[i] = el}/>)}
            </CardWrapper>
            {(showEndRoundAttack && (cardPlayed || playerPull)) && <>
              <EndRound onClick={() => EndAttackRound()}/>
              <p>showEdnRoundAttack</p>
            </>} 
            {(showEndRoundColorMatch && (cardPlayed || playerPull)) && <>
              <EndRound onClick={() => EndRoundColorMatch()}/>
              <p>showEdnRoundColorMatch</p>
              </>} 
            {(showEndRoundPullMatch && (cardPlayed || playerPull)) && 
              <>
              <EndRound onClick={() => EndRoundColorMatch()}/>
              <p>showEdnRoundPullMatch</p>
              </>
            }
            {showColorChanger && <ColorSwitcher/>}
          </InnerWrapper>
      </Wrapper>
    )
}

export default CardDeck
