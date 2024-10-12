import React, { useEffect, useRef, useState } from 'react'
import Card from './Card'
import gsap from 'gsap'
import styled, { css } from 'styled-components'
import useStore from '../store.js'


const Wrapper = styled.div`
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
    const { setPlayedCards,setPlayersCards,playersCards,expandCards,setExpandCards } = useStore();
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
                x: (base + i) * -50,
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

      const clickHandler = (e: React.MouseEvent) => {
        console.log(cardsRef.current);
        const target = e.currentTarget;
        const clientX = e.clientX;
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
              console.log(target);
            const index = cardsRef.current.findIndex(c => c === target);
            cardsRef.current.filter((c, i) => c !== null);
            setPlayedCards({
              card: playersCards[index]?.card,
              color: playersCards[index]?.type,
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
          {Object.values(playersCards).length > 0 && Object.values(playersCards).map((c,i) => <Card onClick={(e: React.MouseEvent) => clickHandler(e)} key={i} card={playersCards[i].card} color={playersCards[i].type} ref={(el) => cardsRef.current[i] = el}/>)}
        </Wrapper>
    )
}

export default CardDeck
