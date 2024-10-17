import React, { useEffect, useRef, useState } from 'react'
import Card from './Card'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import styled from 'styled-components'
import useStore from '../store.js'
import Plus4Confirm from './Plus4Confirm.js'
gsap.registerPlugin(MotionPathPlugin);

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9;
  pointer-events: none;
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
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    z-index: 2;
`




interface Props {}

function CardDeck(props: Props) {
    const {} = props
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [startX,setStartX] = useState(0)
    const [isDragging,setIsDragging] = useState(false)
    const { setPlayedCards,setPlayersCards,setShowPlus4Confirm,showPlus4Confirm,playersCards,playedCards,expandCards,setExpandCards,setShowColorChanger } = useStore();
    const newMatch = useRef(true);



    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.code === 'Space') {
            setExpandCards(!expandCards); 
          }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [expandCards]);
    
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
                y: Math.abs(base + i) * 20 + 100,
                x: (base + i) * -50 + (cardsRef.current.length % 2 == 0 ? -30 : 0),
                duration: 0.5,
                ease: 'circ.inOut',
              });
            });
            gsap.to(cardsRef.current, {
              css: {
                filter: `drop-shadow(0px 0px 30px rgb(0, 0, 0))`,
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
                  filter: `drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.38))`,
                },
                duration: 0.5,
              })
    
          }  
        }, newMatch.current ? 800 : 0);
      }, [expandCards, playersCards]);



      const mouseDownHandler = (e: any) => {
          setStartX(e.clientX);
          setIsDragging(true);
      }

      const mouseUpHandler = () => {
          setIsDragging(false);
      }

      const dragHandler = (e: any) => {
          const deltaX = e.clientX - startX;
        if (isDragging) {

            gsap.to(cardsRef.current, {
                x: deltaX,
            })
        }
      }

      const PlacePlus4 = () => {
        const plus4card = Object.values(playersCards).findIndex(c => c.card === "plus4");
        if (plus4card !== -1) {
          const target = cardsRef.current[plus4card];
          
          if (target) {
            const rect = target.getBoundingClientRect(); 
      
            gsap.to(target, {
              css: {
                filter: `drop-shadow(0px 0px 30px rgb(0, 0, 0))`,
              },
            });
      
            gsap.to(target, {
              x: 0, 
              y: 0,
              scale: 1.2,
              duration: 0.1,
              onComplete: () => {
                cardsRef.current = cardsRef.current.filter((c) => c !== null);
                setPlayedCards({
                  type: playersCards[plus4card]?.type,
                  card: playersCards[plus4card]?.card,
                  x: rect.left + rect.width / 2, 
                  y: rect.top + rect.height / 2, 
                });
      
                gsap.set(target, {
                  x: 0,
                  y: 0,
                  scale: 1,
                });
      
                gsap.set(target, {
                  css: {
                    filter: `drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.38))`,
                  },
                });
      
                const newCards = Object.values(playersCards).filter((_, i) => i !== plus4card);
                setPlayersCards(newCards);
                setExpandCards(false);

                const numberOfCards = Object.values(playersCards).filter(c => c.card == "plus4").length;
                if (numberOfCards < 2) {
                  setShowColorChanger(true);
                  setShowPlus4Confirm(false);
                }
                if (numberOfCards >= 2) {
                  setShowPlus4Confirm(true);
                }
              }
            });
          }
        }
      };

      const cardChecker = (type,card) => {
        const lastCard = playedCards[Object.keys(playedCards).length - 1];
        if (card == "colorchange") {
          setShowColorChanger(true);
        }
        if (card == "plus4") {
          const numberOfCards = Object.values(playersCards).filter(c => c.card == "plus4").length;
          if (numberOfCards < 2) {
            setShowColorChanger(true);
            setShowPlus4Confirm(false);
          }
          if (numberOfCards >= 2) {
            setShowPlus4Confirm(true);
          }
        }
        if (lastCard?.type === type) return true;
        if (lastCard?.card === card) return true;
        if (type == "common") return true;
        console.log("different");
        return false
      }

      const clickHandler = (e: React.MouseEvent) => {
        const target = e.currentTarget;
        const index = cardsRef.current.findIndex(c => c === target);
        const check =cardChecker(playersCards[index]?.type, playersCards[index]?.card);
        if (!check) {
          gsap.to(target, {
            motionPath: {
              path: [
                { x: 0},
                { x: -2,},
                { x: 2},
                { x: -2},
                { x: 2,},
                { x: 0},
              ]},
              duration: 0.5,
            }
          )
          return;
        };

        const clientX = e.clientX;
        console.log(clientX - window.innerWidth / 2);
        const clientY = e.clientY;
        
        const rect = target.getBoundingClientRect();
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const moveX = clientX - centerX;
        const moveY = clientY - centerY;

        gsap.to(target, {
          css: {
            filter: `drop-shadow(0px 0px 30px rgb(0, 0, 0))`,
          },
        })

        gsap.to(target, {
          x: moveX,
          y: moveY,
          scale: 1.2,
          duration: 0.1,
            onComplete: () => {
            cardsRef.current.filter((c, i) => c !== null);
            setPlayedCards({
              type: playersCards[index]?.type,
              card: playersCards[index]?.card,
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
                filter: `drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.38))`,
              }
            })
            
            const newCards = Object.values(playersCards).filter((c, i) => c !== playersCards[index]);
            setPlayersCards(newCards);
            setExpandCards(false);
          }
        });
      };

    return (
      <Wrapper ref={wrapperRef} onMouseMove={(e) => dragHandler(e)} onMouseDown={(e) => mouseDownHandler(e)} onMouseUp={() => mouseUpHandler()}>
          <InnerWrapper>
            <CardWrapper>
          {Object.values(playersCards).length > 0 && Object.values(playersCards).map((c,i) => <Card onClick={(e: React.MouseEvent) => clickHandler(e)} key={i} type={playersCards[i].type} card={playersCards[i].card} ref={(el) => cardsRef.current[i] = el}/>)}
            </CardWrapper>
            {showPlus4Confirm && <Plus4Confirm onClick={PlacePlus4}/>}
          </InnerWrapper>
      </Wrapper>
    )
}

export default CardDeck
