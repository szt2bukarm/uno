import {create} from "zustand";
import cardGenerator from "./utils/Cardgenerator";

const useStore = create((set) => ({
    playersCards: {},
    playerNo: 0,
    playedCards: {
    },
    expandCards: false,
    showColorChanger: false,
    showPlus4Confirm: false,
    currentPlayer: 0,
    numberOfPlayers: 2,
    reversed: false,
    attackedPlayerID: null,
    attackAmount: 0,

    setAttackedPlayerID: (value) => set({ attackedPlayerID: value }),
    setAttackAmount: (value) => set({ attackAmount: value }),
    initializePlayers: () => set((state) =>{
        const playersCards = {};
        for (let i = 0; i < state.numberOfPlayers; i++) {
            playersCards[i] = cardGenerator(7);  
        }

        console.log(playersCards);
        return { playersCards: playersCards };
    }),
    editPlayersCards: (playerID,cards) => set((state) => {
        const newCards = {...state.playersCards, [playerID]: cards};
        return { playersCards: newCards };
    }),
    setReversed: (value) => set({ reversed: value }),
    setShowPlus4Confirm: (value) => set({ showPlus4Confirm: value }),
    setNumberOfPlayers: (value) => set({ numberOfPlayers: value }),
    setCurrentPlayer: (value) => set({ currentPlayer: value }),
    setShowColorChanger: (value) => set({ showColorChanger: value }),
    setExpandCards: (value) => set({ expandCards: value }),
    setPlayedCards: (playedCard) => set((state) => {
        const newKey = Object.keys(state.playedCards).length;
        const newPlayedCards = {
            ...state.playedCards,
            [newKey]: { type: playedCard.type, card: playedCard.card,x:playedCard.x,y:playedCard.y,rotation: ((playedCard.x - window.innerWidth / 2) / 10) * -1 },
        };

        if (Object.keys(newPlayedCards).length > 5) {
            const newCards = Object.values(newPlayedCards).slice(-5);
            console.log(newCards);
            return { playedCards: newCards };
        }
        return { playedCards:  newPlayedCards};
    }),
    setPlayersCards: (playersCards) => set({ playersCards }),
}))

export default useStore