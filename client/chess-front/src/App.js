import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MyChessboard from "./components/MyChessboard";
import HomePage from "./components/HomePage";
import { SocketProvider } from "./context/SocketContext";
import "./App.css";


function App() {
  return (
    <div className="App">
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="*" element={<MyChessboard/>}/>
          </Routes>
        </Router>
      </SocketProvider>

    </div>
  );
}

export default App;
