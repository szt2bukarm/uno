import React, { useEffect, useRef, useState } from 'react';
import useStore from '../store.js';
import useNextPlayer from '../utils/useNextPlayer.js';
import styled from 'styled-components';
import gsap from 'gsap';

const colors = ["red", "blue", "green", "yellow"];

const Wrapper = styled.div`
    width: 1000px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    rotate: 180deg;
    transition: opacity .3s;
    transition-delay: 500ms;
`;

const Card = styled.img`
  min-width: 135px;
  height: 225px;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.05s;
  user-select: none;
  opacity: 0;
`;

interface props {
    playerNo: number,
}

function EnemyPlayer({ playerNo: botNo }: props) {
    const { blockedPlayerID,setBlockedPlayerID, setBotPull, botPull, setAttackedPlayerID, setAttackAmount, reversed, setReversed, currentPlayer, setCurrentPlayer, playedCards, setPlayedCards, playersCards, editPlayersCards } = useStore();
    const cardsRef = useRef<HTMLDivElement>([]);
    const getNextPlayer = useNextPlayer();

    useEffect(() => {
        cardsRef.current = cardsRef.current.filter(c => c != null);
        gsap.to(cardsRef.current, { opacity: 1, delay: 0.5 });
        cardsRef.current.forEach((c, i) => {
            const base = Math.ceil(0 - cardsRef.current.length / 2);
            gsap.to(c, {
                rotate: `${(base + i) * 5}deg`,
                y: Math.abs(base + i) * 20 + 100,
                x: (base + i) * -50,
                duration: 1,
                delay: 0.5,
                ease: 'circ.inOut',
            });
        });
    }, [cardsRef, Object.values(playersCards[botNo])]);

    useEffect(() => {
        // console.log("bot")
        // console.log(blockedPlayerID)
        // console.log(botNo)
        if (+blockedPlayerID == +botNo) {
            console.log(blockedPlayerID + "blocked")
          gsap.to(cardsRef.current, {
            filter: `saturate(0)`,
            duration: 0.5
          })
          gsap.to(cardsRef.current, {
            filter: `saturate(1)`,
            duration: 0.5,
            delay: 1,
          })
          setTimeout(() => {
              setCurrentPlayer(getNextPlayer());
              setBlockedPlayerID(-1);
            }, 1000);
        }
      }, [blockedPlayerID,currentPlayer,cardsRef])

    const addCardToPlayedCards = (index) => {
        const target = cardsRef.current[index];
        const card = Object.values(playersCards[botNo])[index];
        let setCard = card?.card;
        let setType = card?.type;

        const initialRect = target.getBoundingClientRect();
        let centerX = initialRect.left + initialRect.width / 2;
        let centerY = initialRect.top + initialRect.height / 2;

        if (card.card === "colorchange") {
            const color = colors[Math.floor(Math.random() * colors.length)];
            setType = color;
            setCard = "colorchange";
        }

        if (card.card === "plus2") {
            setTimeout(() => {
                setAttackedPlayerID(getNextPlayer());
                setAttackAmount(2);
            }, 200);
        }

        if (card.card == "plus4") {
            setTimeout(() => {
                setAttackedPlayerID(getNextPlayer());
                setAttackAmount(4);
                const color = colors[Math.floor(Math.random() * colors.length)];
                setType = color;
                setCard = "plus4";
            }, 200);
        }

        if (card.card === "reverse") {
            setReversed(!reversed);
        }

        if (card.card === "block") {
            setBlockedPlayerID(getNextPlayer())
        }

        setTimeout(() => {
            const updatedRect = target.getBoundingClientRect();
            centerX = updatedRect.left + updatedRect.width / 2;
            centerY = updatedRect.top + updatedRect.height / 2;

            const newCards = Object.values(playersCards[botNo]).filter((c, i) => c !== card);
            editPlayersCards(botNo, newCards);
            setCurrentPlayer(getNextPlayer());
            setPlayedCards({
                type: setType,
                card: setCard,
                x: centerX,
                y: centerY,
            });
        }, 1000);
    };

    const checkCards = () => {
        const lastCard = playedCards[Object.keys(playedCards).length - 1];
        const botCards = Object.values(playersCards[botNo]);
        const commonIndex = botCards.findIndex(c => c.type === "common");
        const cardIndex = botCards.findIndex(c => c.card === lastCard.card);
        const typeIndex = botCards.findIndex(c => c.type === lastCard.type);

        if (typeIndex != -1) {
            if (lastCard?.type == botCards[typeIndex].type) return typeIndex;
        }
        if (cardIndex != -1) {

            if (lastCard?.card == botCards[cardIndex].card) return cardIndex;
        }
        if (commonIndex != -1) {

            return commonIndex;
        }
        return -1;
    }

    const botMove = () => {
        if (currentPlayer != botNo) return;
        const decision = checkCards();
        // console.log("dec:" + decision)
        if (decision == -1 && !botPull) {
            setBotPull(true);
            return;
        }
        const botCards = Object.values(playersCards[botNo]);
        // console.log(botCards[decision])
        addCardToPlayedCards(decision);
    }

    const [newCardAdded, setNewCardAdded] = useState(false);

    useEffect(() => {
        if (botPull && currentPlayer == botNo) {
            setTimeout(() => {
                setBotPull(false);
                setNewCardAdded(true); 
            }, 501);
        }
    }, [botPull]);

    useEffect(() => {
            // console.log(Object.values(playersCards[botNo]))
            if (newCardAdded && currentPlayer == botNo) {
                const decision = checkCards();
                setNewCardAdded(false);
                if (decision !== -1) {
                    addCardToPlayedCards(decision); 
                } else {
                    setCurrentPlayer(getNextPlayer());
                }
            }
    }, [newCardAdded]);

    useEffect(() => {
        setTimeout(() => {
            if (currentPlayer === botNo && blockedPlayerID != botNo) {
                botMove();
            }
        }, 500);
    }, [currentPlayer]);


    return (
        <Wrapper style={{ opacity: currentPlayer === botNo ? 1 : 0.5 }}>
            {Object.values(playersCards[botNo]).map((card, i) => (
                <Card ref={(el) => cardsRef.current[i] = el} key={i} src={`public/cards/${card.type}/${card.card}.png`} />
            ))}
        </Wrapper>
    );
}

export default EnemyPlayer;
