    import { create } from "zustand";
    import {socket,deckChangedOnline} from './socket'
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
        lastCardAttack: false,
        lastCardPlayer: -1,
        lastCardName: null,
        blockActions: false,
        gameEnded: false,
        gameEndedWinner: null,

        setDeck: (value) => set({ deck: value }),

        // player details
        playerNo: 0,
        playerName: null,
        setPlayerNo: (value) => set({ playerNo: value }),
        setPlayerName: (value) => set({ playerName: value }),

        // online state
        onlineMatch: false,
        playerID: null,
        hostID: null,
        lobbyId: null,
        premadeLobby: false,
        playerList: null,
        setPlayerID: (value) => set({ playerID: value }),
        setHostID: (value) => set({ hostID: value }),
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
        setLastCardAttack: (value) => set({ lastCardAttack: value }),
        setLastCardPlayer: (value) => set({ lastCardPlayer: value }),
        setLastCardName: (value) => set({ lastCardName: value }),
        setBlockActions: (value) => set({ blockActions: value }),
        setGameEnded: (value) => set({ gameEnded: value }),
        setGameEndedWinner: (value) => set({ gameEndedWinner: value }),

        drawCard: () => {
            const currentDeck = get().deck;
            console.log(currentDeck)
            if (currentDeck.length === 0) {
                const deck = generateFullDeck();
                const lastDrawnCard = deck[0];
                const newDeck = deck.slice(1);

                set({ deck: deck });
                if (get().onlineMatch) {
                    deckChangedOnline(get().lobbyId,newDeck)
                }
                return { type: lastDrawnCard.type, card: lastDrawnCard.card };
            }
            const lastDrawnCard = currentDeck[0];
            const newDeck = currentDeck.slice(1);

            set({ deck: newDeck });
            if (get().onlineMatch) {
                deckChangedOnline(get().lobbyId,newDeck)
            }
            return { type: lastDrawnCard.type, card: lastDrawnCard.card };
        },
        
        editPlayersCards: (playerID, cards) => set((state) => {
            const newCards = { ...state.playersCards, [playerID]: cards };

            if (newCards[playerID].length == 0) {
                return {
                    playersCards: newCards,
                    gameEnded: true,
                };
            }

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
