import useStore from "../store";

export default function useNextPlayer() {
    const { reversed, currentPlayer, numberOfPlayers } = useStore();

    const getNextPlayer = (n) => {
        if (reversed) {
            return currentPlayer === 0 ? numberOfPlayers - n : currentPlayer - n;
        } else {
            return currentPlayer === numberOfPlayers - 1 ? 0 : currentPlayer + n;
        }
    };

    return getNextPlayer;
}
