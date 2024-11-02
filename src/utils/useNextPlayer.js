import useStore from "../store";

export default function useNextPlayer() {
    const { reversed, currentPlayer, numberOfPlayers } = useStore();

    const getNextPlayer = () => {
        if (reversed) {
            return currentPlayer === 0 ? numberOfPlayers - 1 : currentPlayer - 1;
        } else {
            return currentPlayer === numberOfPlayers - 1 ? 0 : currentPlayer + 1;
        }
    };

    return getNextPlayer;
}
