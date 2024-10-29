const types = ["red","blue","green","yellow"];
const cards = ["0","1","2","3","4","5","6","7","8","9","reverse","block","plus2"];
const common = ["plus4","colorchange"];

const cardGenerator = (n) => {
    const cardObject = {};
    for (let i = 0; i < n; i++) {
        const cardTypeChance = Math.floor(Math.random() * 20);
        if (cardTypeChance < 18) {
            const type = types[Math.floor(Math.random() * types.length)];
            const card = cards[Math.floor(Math.random() * cards.length)];
            cardObject[i] = { type, card };
        } else {
            const card = common[Math.floor(Math.random() * common.length)];
            cardObject[i] = { type: "common", card };
        }
    }
    return cardObject;
};

export default cardGenerator;
