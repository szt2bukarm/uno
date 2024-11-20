import { io } from 'socket.io-client';

const socket = io('http://192.168.0.122:3000', { autoConnect: false });

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

const cardPulledOnline = (lobbyId,newCards,newDeck,player) => {
    socket.emit('cardpulled', lobbyId,newCards,newDeck,player, (response) => {
        resolve(response);
    });
}

const attackOnline = (lobbyId, newCards,newDeck, player, amount) => {
    socket.emit('attack', lobbyId, newCards,newDeck, player, amount, (response) => {
        resolve(response);
    });
}

const attackPulledOnline = (lobbyId,newCards,newDeck,player) => {
    socket.emit('attackpulled', lobbyId,newCards,newDeck,player, (response) => {
        resolve(response);
    });
}

const blockOnline = (lobbyId,player) => {
    socket.emit('block', lobbyId,player, (response) => {
        resolve(response);
    });
}

export { socket, connectSocket, disconnectSocket, createLobby,checkLobby, joinLobby,leaveLobby,startGame,cardPlayedOnline,changePlayerOnline,cardPulledOnline,attackOnline,attackPulledOnline,blockOnline };