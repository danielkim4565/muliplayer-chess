import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useState, useContext} from "react";
import SocketContext from "../context/SocketContext";

export default function MyChessboard() {
    const socket = useContext(SocketContext);
    const [game, setGame] = useState(new Chess());
    const [code, setCode] = useState("");
    const [side, setSide] = useState({long: "", short: ""});
    const [chessboardSize, setChessboardSize] = useState(undefined);

    const sendMove = () => {
        socket.emit("send_move", {move: game.fen(), roomCode: code})
    }

    function makeAMove(move) {
        const gameCopy = { ...game };
        const result = gameCopy.move(move);
        if (result === null){
            return null;
        } else if (result.color === side.short) {
            setGame(gameCopy);
            return result;
        } else if (result.color !== side.short) {
            gameCopy.undo();
            return null;
        }
    }

    function loadBoard(fen) {
        const gameCopy = { ...game };
        gameCopy.load(fen);
        setGame(gameCopy);
    }
    
    useEffect(() => {
        socket.on("receive_move", (data) => {
            console.log("got move:" + data.move);
            loadBoard(data.move)
        })
        socket.once("receive_initial_data", (data) => {
            console.log("room with code:" + data.roomCode);
            setSide(data.side);
            setCode(data.roomCode);
        })
        socket.on("want_room_data", (data) => {
            socket.emit("send_room_data", {board: game.fen(), side: side, requestingSocket: data.requestingSocket});
        })
        socket.on("receive_room_data", (data) => {
            setSide(data.side)
            setTimeout(() => {loadBoard(data.board)}, 500)
        })
        function handleResize() {
            const display = document.getElementsByClassName("container")[0];
            setChessboardSize(display.offsetWidth - 20);
        }
        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
          socket.off("receive_move");
          socket.off("receive_code");
          socket.off("want_room_data");
          socket.off("receive_room_data");
          window.removeEventListener("resize", handleResize)
        }
    });

    //useEffect(() =>{ const gameCopy = { ...game }; gameCopy.load(game.fen()); setGame(gameCopy);}, [game])

    function onDrop(sourceSquare, targetSquare) {
        const move = {
            from: sourceSquare,
            to: targetSquare,
            promotion:'q'
        };
        // const gameCopy = { ...game };
        // const result = gameCopy.move(move);
        // setGame(game);
        const result = makeAMove(move);
        if (result === null) {  
            return false;
        }
        sendMove();
        return true;
    }

    const pieces = ['wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'];
    const customPieces = () => {
        const returnPieces = {};
        pieces.map((p) => {
        returnPieces[p] = ({ squareWidth }) => (
            <div
            style={{
                width: squareWidth,
                height: squareWidth,
                backgroundImage: `url(/pieces/${p}.png)`,
                backgroundSize: '100%',
            }}
            />
        );
        return null;
        });
        return returnPieces;
    };


    return (
        <div className="container">
            <h1>Room Code: {code}</h1>
            <Chessboard 
                className="chessBoard"
                boardOrientation={side.long} 
                position={game.fen()} 
                onPieceDrop={onDrop}
                customBoardStyle={{
                    borderRadius: '4px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                  }}
                  customDarkSquareStyle={{ backgroundColor: '#779952' }}
                  customLightSquareStyle={{ backgroundColor: '#edeed1' }}
                  customPieces={customPieces()} 
                boardWidth={chessboardSize}
            />
        </div>
    )
}