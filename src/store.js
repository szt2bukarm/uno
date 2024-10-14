import {create} from "zustand";

const useStore = create((set) => ({
    players: [],
    playedCards: {
    },
    playersCards: {
    },
    expandCards: false,
    showColorChanger: false,
    currentPlayer: 0,
    numberOfPlayers: 0,
    setNumberOfPlayers: (value) => set({ numberOfPlayers: value }),
    setCurrentPlayer: (value) => set({ currentPlayer: value }),
    setShowColorChanger: (value) => set({ showColorChanger: value }),
    setExpandCards: (value) => set({ expandCards: value }),
    setPlayedCards: (playedCard) => set((state) => {
        const newKey = Object.keys(state.playedCards).length;
        const newPlayedCards = {
            ...state.playedCards,
            [newKey]: { type: playedCard.type, card: playedCard.card,x:playedCard.x,y:playedCard.y },
        };
        return { playedCards: newPlayedCards };
    }),
    setPlayersCards: (playersCards) => set({ playersCards }),
    setPlayers: (players) => set({ players }),
    addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
    removePlayer: (player) => set((state) => ({ players: state.players.filter((p) => p !== player) })),
}))

export default useStore