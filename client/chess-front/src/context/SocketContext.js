import { createContext} from "react"
import io from "socket.io-client";

const IS_PROD = process.env.NODE_ENV === "production";
const URL = IS_PROD ? "https://chess-daniel-kim.herokuapp.com/" : "http://localhost:3001";

const socket = io.connect(URL);

const SocketContext = createContext();

export function SocketProvider({ children }) {
    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    )
}


export default SocketContext;