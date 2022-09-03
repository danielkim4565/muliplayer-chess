import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useState } from "react"
import SocketContext from "../context/SocketContext";
import { useContext } from "react"
import { Button, Grid, TextField } from "@mui/material";

export default function HomePage() {
  const socket = useContext(SocketContext)

  const [roomCode, setRoomCode] = useState("");

  let navigate = useNavigate(); 
  const createRoom = () =>{ 
    let path = "/game"; 
    navigate(path);
    socket.emit("create_room");
  }
  const joinRoom = (event) =>{ 
    let path = "/game"; 
    navigate(path);
    socket.emit("join_room", {roomCode: roomCode, socketId: socket.id});
  }


  return (
    <div>
      <h1 className="title">CHESS</h1>
      <p className="byCreator">by Daniel Kim</p>
      {/* <input name="roomCode" placeholder="Room Code..." onChange={(event) => {setRoomCode(event.target.value)}}/> */}
      <Grid container direction="column">
        <Grid container item xs={12} justifyContent="center">
          <Button sx={{ width: `calc(31.75% + 1px)`, height: 55, mb: 1 }} className="Button" onClick={createRoom} variant="contained" color="success" >Create Room</Button>
        </Grid>
        <Grid container item xs={12} justifyContent="center" >
          <TextField sx={{ width: 1/4 , mr: 0.5 }} onChange={(event) => {setRoomCode(event.target.value)}} label="Room Code..." variant="outlined" />
          <Button sx={{ width: 1/16, ml: 0.5, height: 55 }} className="Button" onClick={joinRoom} variant="outlined" color="success">Join Room</Button>
        </Grid>
        {/* <Grid container item xs={2} justifyContent="flex-start" alignItems="stretch" style={{ display: "flex" }}>
        </Grid> */}
        
      </Grid>
    </div>  
  )
}