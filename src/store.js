    import { create } from "zustand";

    export const generateFullDeck = () => {
        const types = ["red", "blue", "green", "yellow"];

        const deck = [];
        
        for (const type of types) {
            deck.push({ type, card: "0" });
            for (let i = 1; i <= 9; i++) {
                deck.push({ type, card: String(i) });
                deck.push({ type, card: String(i) });
            }
        }

        for (const type of types) {
            ["reverse", "block", "plus2"].forEach(action => {
                deck.push({ type, card: action });
                deck.push({ type, card: action });
            });
        }

        for (let i = 0; i < 4; i++) {
            deck.push({ type: "common", card: "colorchange" });
            deck.push({ type: "common", card: "plus4" });
        }

        return deck.sort(() => Math.random() - 0.5); 
    };

    const initializePlayers = () => {
            const playersCards = {};
            for (let i = 0; i < state.numberOfPlayers; i++) {
                playersCards[i] = Array.from({ length: 7 }, () => state.drawCard());
            }
            return { playersCards };
    }

    // Zustand store
    const useStore = create((set,get) => ({
        deck: null,
        playersCards: {},
        playedCards: {},
        expandCards: false,
        showColorChanger: false,
        basicColorChanger: true,
        currentPlayer: 0,
        numberOfPlayers: 2,
        reversed: false,
        attackedPlayerID: -1,
        attackAmount: 0,
        allowCardPull: false,
        blockedPlayerID: -1,
        botPull: false,
        playerPull: false,
        showEndRoundAttack: false,
        showEndRoundColorMatch: false,
        roundOverFlag: false,

        setDeck: (value) => set({ deck: value }),

        // player details
        playerNo: 0,
        playerName: null,
        setPlayerNo: (value) => set({ playerNo: value }),
        setPlayerName: (value) => set({ playerName: value }),

        // online state
        onlineMatch: false,
        lobbyId: null,
        premadeLobby: false,
        playerList: null,
        setOnlineMatch: (value) => set({ onlineMatch: value }),
        setLobbyId: (value) => set({ lobbyId: value }),
        setPremadeLobby: (value) => set({ premadeLobby: value }),
        setPlayerList: (value) => set({ playerList: value }),

        // menu and transition
        currentMenuPage: "main",
        gameStarted: false,
        transition: false,
        setTransition: (value) => set({ transition: value }),
        setGameStarted: (value) => set({ gameStarted: value }),
        setCurrentMenuPage: (value) => set({ currentMenuPage: value }),
        
        setRoundOverFlag: (value) => set({ roundOverFlag: value }),
        setShowEndRoundAttack: (value) => set({ showEndRoundAttack: value }),
        setShowEndRoundColorMatch: (value) => set({ showEndRoundColorMatch: value }),
        setBlockedPlayerID: (value) => set(() => ({ blockedPlayerID: value })),
        setBasicColorChanger: (value) => set({ basicColorChanger: value }),
        setBotPull: (value) => set({ botPull: value }),
        setPlayerPull: (value) => set({ playerPull: value }),
        setAllowCardPull: (value) => set({ allowCardPull: value }),
        setAttackedPlayerID: (value) => set(() => ({ attackedPlayerID: value })),
        setAttackAmount: (value) => set({ attackAmount: value }),

        drawCard: () => {
            const currentDeck = get().deck;
            const lastDrawnCard = currentDeck[0];
            const newDeck = currentDeck.slice(1);
            if (newDeck.length === 0) {
                set({ deck: generateFullDeck() });
            }
            set({ deck: newDeck }); 
            return { type: lastDrawnCard.type, card: lastDrawnCard.card };
        },
        
        editPlayersCards: (playerID, cards) => set((state) => {
            const newCards = { ...state.playersCards, [playerID]: cards };
            return { playersCards: newCards };
        }),
        
        setReversed: (value) => set({ reversed: value }),
        setNumberOfPlayers: (value) => set({ numberOfPlayers: value }),
        setCurrentPlayer: (value) => set(() => ({ currentPlayer: value })),
        setShowColorChanger: (value) => set({ showColorChanger: value }),
        setExpandCards: (value) => set({ expandCards: value }),

        setPlayedCards: (playedCard) => set((state) => {
            const newKey = Object.keys(state.playedCards).length;
            const newPlayedCards = {
                ...state.playedCards,
                [newKey]: { 
                    type: playedCard.type, 
                    card: playedCard.card, 
                    x: playedCard.x, 
                    y: playedCard.y, 
                    rotation: ((playedCard.x - window.innerWidth / 2) / 10) * -1 
                },
            };

            if (Object.keys(newPlayedCards).length > 5) {
                const newCards = Object.values(newPlayedCards).slice(-5);
                return { playedCards: newCards };
            }
            return { playedCards: newPlayedCards };
        }),

        setPlayersCards: (playersCards) => set({ playersCards }),
    }));

    export default useStore;
