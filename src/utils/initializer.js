import useStore from '../store'

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
        ["block", "plus2","reverse"].forEach(action => {
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

export const initializePlayers = (n) => {
    const types = ["red","blue","green","yellow"]
    const cards = ["0","1","2","3","4","5","6","7","8","9"]

    const type = types[Math.floor(Math.random() * types.length)];
    const card = cards[Math.floor(Math.random() * cards.length)];


    const deck = generateFullDeck();
    const cardsObj = {}
    for (let i = 0; i < n; i++) {
        cardsObj[i] = Array.from({length: 7 },() => deck.pop());
    }
    
    return { deck, cards: cardsObj,type,card};
}