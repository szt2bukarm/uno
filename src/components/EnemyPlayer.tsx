import React, { useEffect, useRef, useState } from "react";
import useStore from "../store.js";
import useNextPlayer from "../utils/useNextPlayer.js";
import styled from "styled-components";
import gsap from "gsap";
import { socket,blockOnline,cardPlayedOnline,changePlayerOnline,checkCardsOnline,attackOnline } from '../socket.js'

const colors = ["red", "blue", "green", "yellow"];

const Wrapper = styled.div`
  width: 100rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  rotate: 180deg;
  transition: opacity 0.3s;
  transition-delay: 500ms;
`;

const Card = styled.img`
  min-width: 13.5rem;
  height: 22.5rem;
  border-radius: 2rem;
  overflow: hidden;
  transition: all 0.05s;
  user-select: none;
  opacity: 0;
`;

interface props {
  playerNo: number;
  playerName: string;
  isBot: boolean;
}

function EnemyPlayer({ playerNo,playerName, isBot }: props) {
  const {
    setGameEndedWinner,
    drawCard,
    lobbyId,
    hostID,
    playerID,
    onlineMatch,
    setRoundOverFlag,
    roundOverFlag,
    blockedPlayerID,
    setLastCardAttack,
    setLastCardPlayer,
    setLastCardName,
    setBlockedPlayerID,
    setBotPull,
    botPull,
    setAttackedPlayerID,
    setAttackAmount,
    reversed,
    setReversed,
    currentPlayer,
    setCurrentPlayer,
    playedCards,
    setPlayedCards,
    playersCards,
    editPlayersCards,
  } = useStore();
  const cardsRef = useRef<HTMLDivElement>([]);
  const getNextPlayer = useNextPlayer();

  // online match
  useEffect(() => {
    if (!onlineMatch) return;

    const cardPlayedHandler = (data) => {
        if (data.player == playerNo) {
            addCardToPlayedCardsOnline(data.cardIndex, data.playersCards, data.playedType, data.playedCard);
        }
    };

    const changePlayerHandler = (data) => {
        setCurrentPlayer(data.player);
    };

    socket.on('cardplayednotification', cardPlayedHandler);
    socket.on('changeplayernotification', changePlayerHandler);

    return () => {
        // Cleanup listeners
        socket.off('cardplayednotification', cardPlayedHandler);
        socket.off('changeplayernotification', changePlayerHandler);
    };
}, []);


  const addCardToPlayedCardsOnline = (index,newCards,type,card) => {
    const target = cardsRef.current[index];

    const updatedRect = target.getBoundingClientRect();
    const centerX = updatedRect.left + updatedRect.width / 2;
    const centerY = updatedRect.top + updatedRect.height / 2;
    editPlayersCards(playerNo, newCards);
    setPlayedCards({
      type: type,
      card: card,
      x: centerX,
      y: centerY,
    });
  };

  // animation for enemy cards to appear
  useEffect(() => {
    cardsRef.current = cardsRef.current.filter((c) => c != null);
    gsap.to(cardsRef.current, { opacity: 1, delay: 0.5 });
    cardsRef.current.forEach((c, i) => {
      const base = Math.ceil(0 - cardsRef.current.length / 2);
      gsap.to(c, {
        rotate: `${(base + i) * 5}deg`,
        y: `${Math.abs(base + i) * 2 + 10}rem`,
        x: `${(base + i) * -5}rem`,
        duration: 1,
        delay: 0.5,
        ease: "circ.inOut",
      });
    });
  }, [cardsRef, Object.values(playersCards[playerNo])]);


  const addCardToPlayedCards = (index) => {
    const target = cardsRef.current[index];
    const card = Object.values(playersCards[playerNo])[index];
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

    if (card.card === "reverse") {
      setReversed(!reversed);
    }

    if (card.card === "block") {
      setBlockedPlayerID(getNextPlayer());
      if (onlineMatch && isBot) blockOnline(lobbyId,getNextPlayer());
    }

    if (card.card === "plus2") {

        if (!onlineMatch) {
          setAttackedPlayerID(getNextPlayer());
          setAttackAmount(2);  
        }

        if (onlineMatch && (hostID == playerID)) {
          const nextPlayer = getNextPlayer();
          const newCards = {...playersCards[nextPlayer]};
          for (let i = 0; i < 2; i++) {
            const cardData = drawCard();
            newCards[Object.keys(playersCards[nextPlayer]).length + i] = { type: cardData.type, card: cardData.card };
        }    
        attackOnline(lobbyId,newCards,nextPlayer,2)
        }
    }

    if (card.card == "plus4") {

        if (!onlineMatch) {
          setAttackedPlayerID(getNextPlayer());
          setAttackAmount(4);  
        }

        const color = colors[Math.floor(Math.random() * colors.length)];
        setType = color;
        setCard = "plus4";

        if (onlineMatch && (hostID == playerID)) {
          const nextPlayer = getNextPlayer();
          const newCards = {...playersCards[nextPlayer]};
          for (let i = 0; i < 4; i++) {
            const cardData = drawCard();
            newCards[Object.keys(playersCards[nextPlayer]).length + i] = { type: cardData.type, card: cardData.card };
        }    
        attackOnline(lobbyId,newCards,nextPlayer,4)
        }
    }

    setTimeout(() => {
      const updatedRect = target.getBoundingClientRect();
      centerX = updatedRect.left + updatedRect.width / 2;
      centerY = updatedRect.top + updatedRect.height / 2;

      const newCards = Object.values(playersCards[playerNo]).filter(
        (c) => c !== card
      );
      // if (!onlineMatch) {
        editPlayersCards(playerNo, newCards);
        setPlayedCards({
          type: setType,
          card: setCard,
          x: centerX,
          y: centerY,
        });
      // }
      
      setRoundOverFlag(true);
      // if (onlineMatch && isBot) cardPlayedOnline(lobbyId,setType,setCard,index,newCards,playerNo)
    }, 200);
  };


  // check for block
  useEffect(() => {
    if (+blockedPlayerID == +playerNo) {
      gsap.to(cardsRef.current, {
        filter: `saturate(0)`,
        duration: 0.5,
        delay: 0.5,
      });
      gsap.to(cardsRef.current, {
        filter: `saturate(1)`,
        duration: 0.5,
        delay: 2,
      });
      setTimeout(() => {
        setCurrentPlayer(getNextPlayer());
        setBlockedPlayerID(-1);
      }, 2500);
    }
  }, [blockedPlayerID, currentPlayer, cardsRef]);

  // check bot cards
  const checkCards = () => {
    const lastCard = playedCards[Object.keys(playedCards).length - 1];
    const botCards = Object.values(playersCards[playerNo]);
    const commonIndex = botCards.findIndex((c) => c.type === "common");
    const cardIndex = botCards.findIndex((c) => c.card === lastCard.card);
    const typeIndex = botCards.findIndex((c) => c.type === lastCard.type);

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
  };

  useEffect(() => {
    const checkCardsHandler = (data) => {
      if (data.playerNo == playerNo) {
        console.log(data.cardIndex)
        if (data.cardIndex == -1 && !botPull) {
          setBotPull(true);
          return;
        }

        addCardToPlayedCards(data.cardIndex);
      }
    }
    socket.on('checkcardsbotnotification', checkCardsHandler)
    return () => {
      socket.off('checkcardsbotnotification', checkCardsHandler)
    }
  },[Object.values(playersCards[playerNo])])

  // bot move
  const botMove = () => {
    if (onlineMatch && !isBot) return;
    if (currentPlayer != playerNo) return;
    if (onlineMatch && (hostID == playerID)) {
      checkCardsOnline(lobbyId,Object.values(playersCards[playerNo]),playedCards[Object.keys(playedCards).length - 1],playerNo);
    }

    if (!onlineMatch) {
      const decision = checkCards();

      // bot had no playable card and had not pulled yet. Prepare to pull
      if (decision == -1 && !botPull) {
        setBotPull(true);
        return;
      }
  
      addCardToPlayedCards(decision);
    }

  };

  
  // bot had no playable card. Pull a card
  const [newCardAdded, setNewCardAdded] = useState(false);
  useEffect(() => {
    if (onlineMatch && !isBot) return;
    if (botPull && currentPlayer == playerNo) {
      setTimeout(() => {
        setBotPull(false);
        setNewCardAdded(true);
      }, 501);
    }
  }, [botPull]);

  // bot had no playale card. Check if newly added card can be played
  useEffect(() => {
    if (onlineMatch && !isBot) return;
    if (newCardAdded && currentPlayer == playerNo) {
      const decision = checkCards();
      setNewCardAdded(false);
      if (decision !== -1) {
        addCardToPlayedCards(decision);
      } else {
        setRoundOverFlag(true);
      }
    }
  }, [newCardAdded]);

  // check if current round's turn is for bot
  useEffect(() => {
    if ((currentPlayer != playerNo) || (blockedPlayerID == playerNo)) return;
    setRoundOverFlag(false);
    setTimeout(() => {
      botMove();
    }, 1800);
  },[currentPlayer])


  // end round, set next player
  useEffect(() => {
    if (onlineMatch && !isBot) return;
    if (roundOverFlag && currentPlayer === playerNo) {
      if (Object.values(playersCards[playerNo]).length == 0) {
        setGameEndedWinner(playerName);
      }
      if (Object.values(playersCards[playerNo]).length == 1) {
        setLastCardAttack(true);
        setLastCardPlayer(playerNo);
        setLastCardName(playerName);
      } else {
        if (!onlineMatch) setCurrentPlayer(getNextPlayer());
        if (onlineMatch) changePlayerOnline(lobbyId,getNextPlayer());
      }
}
  }, [roundOverFlag]);



  return (
    <Wrapper style={{ opacity: currentPlayer === playerNo ? 1 : 0.5 }}>
      {Object.values(playersCards[playerNo]).map((card, i) => (
        <Card
          ref={(el) => (cardsRef.current[i] = el)}
          key={i}
          src={`public/cards/1.png`}
        />
      ))}
    </Wrapper>
  );
}

export default EnemyPlayer;
