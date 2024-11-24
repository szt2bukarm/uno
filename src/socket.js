import { io } from 'socket.io-client';

const socket = io('localhost:3000', { autoConnect: false });

const connectSocket = () => {
  socket.connect();
};

const disconnectSocket = () => {
  socket.disconnect();
};


const createLobby = (playerName) => {
    return new Promise((resolve) => {
        socket.emit('createlobby', playerName, (response) => {
            resolve(response);
        });
    })
};

const joinLobby = (lobbyId,playerName) => {
    return new Promise((resolve) => {
        socket.emit('joinlobby', lobbyId,playerName, (response) => {
            resolve(response);
        });
    })
};

const checkLobby = (lobbyId) => {
    return new Promise((resolve) => {
        socket.emit('checklobby', lobbyId, (response) => {
            resolve(response);
        })
    })
}

const leaveLobby = (lobbyId) => {
    return new Promise((resolve) => {
        socket.emit('leavelobby', lobbyId, (response) => {
            resolve(response);
        });
    })
};

const startGame = (lobbyId,deck,playersCards,initialType,initailCard) => {
    socket.emit('startgamehost', lobbyId,deck,playersCards,initialType,initailCard, (resolve) => {
        resolve(response);
    })
}

const deckChangedOnline = (lobbyId,deck) => {
    socket.emit('deckchanged', lobbyId,deck, (response) => {
        resolve(response);
    });
}

const cardPlayedOnline = (lobbyId,playedType,playedCard,cardIndex,playersCards,player) => {
    socket.emit('cardplayed', lobbyId,playedType,playedCard,cardIndex,playersCards,player, (response) => {
        resolve(response);
    });
}

const changePlayerOnline = (lobbyId,player) => {
    socket.emit('changeplayer', lobbyId,player, (response) => {
        resolve(response);
    });
}

const cardPulledOnline = (lobbyId,newCards,player) => {
    socket.emit('cardpulled', lobbyId,newCards,player, (response) => {
        resolve(response);
    });
}

const attackOnline = (lobbyId, newCards, player, amount) => {
    socket.emit('attack', lobbyId, newCards, player, amount, (response) => {
        resolve(response);
    });
}

const blockOnline = (lobbyId,player) => {
    socket.emit('block', lobbyId,player, (response) => {
        resolve(response);
    });
}

const checkCardsOnline = (lobbyId, cards, lastPlayed, playerNo) => {
    socket.emit('checkcardsbot', lobbyId, cards, lastPlayed, playerNo, (response) => {
        resolve(response);
    });
}

const lastCardOnline = (lobbyId,name,player) => {
    socket.emit('lastcard', lobbyId,name,player, (response) => {
        resolve(response);
    });
}

const lastCardAttackOnline = (lobbyId,attackedPlayer,attacker) => {
    socket.emit('lastcardattack', lobbyId,attackedPlayer,attacker, (response) => {
        resolve(response);
    });
}

export { socket, connectSocket, disconnectSocket, createLobby,checkLobby, joinLobby,leaveLobby,startGame,cardPlayedOnline,changePlayerOnline,cardPulledOnline,attackOnline,blockOnline,deckChangedOnline,checkCardsOnline, lastCardOnline, lastCardAttackOnline };