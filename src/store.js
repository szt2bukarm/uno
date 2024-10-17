import {create} from "zustand";

const useStore = create((set) => ({
    players: [],
    playedCards: {
    },
    playersCards: {
    },
    expandCards: false,
    showColorChanger: false,
    showPlus4Confirm: false,
    currentPlayer: 0,
    numberOfPlayers: 2,
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
    setPlayers: (players) => set({ players }),
    addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
    removePlayer: (player) => set((state) => ({ players: state.players.filter((p) => p !== player) })),
}))

export default useStore