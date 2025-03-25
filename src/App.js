import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Room from "./Room";
import './App.css'

const socket = io(process.env.REACT_APP_SERVER_URL || "http://localhost:4000");

const App = () => {
  const [name, setName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("updateUsers", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinChat = () => {
    if (name.trim()) {
      socket.emit("join", name);
      setIsJoined(true);
    }
  };

  return (
    <Router>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Routes>
          <Route
            path="/"
            element={
              !isJoined ? (
                <div className="loginTime">
                  <h2 style={{ fontSize: '35px' }}>Ismingizni kiriting:</h2>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sizning ismingiz"
                    style={{ borderRadius: '10px', width: '300px', height: '70px', fontSize: '30px', border: '2px solid black', paddingLeft: '15px', color: 'black' }}
                  />
                  <br />
                  <button
                    onClick={joinChat}
                    style={{ width: '300px', height: '150px', marginTop: '25px', fontSize: '50px', color: 'black', fontWeight: '700', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                    Kirish
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="">Kimlar xozir saytda:</h2>
                  <h1 style={{}}>
                    {users.map((user, index) => (
                      <p key={index}>{user} <strong style={{color: '#23ff28'}}>(Online)</strong></p>
                    ))} 
                  </h1>
                  <Link to="/room">
                    <button
                      onClick={joinChat}
                      style={{ width: '300px', height: '150px', marginTop: '25px', fontSize: '35px', color: 'black', fontWeight: '700', borderRadius: '10px', border: '3px solid yellow', cursor: 'pointer' }}>
                      Kino uchun zal
                    </button>
                  </Link>
                </div>
              )
            }
          />
          <Route path="/room" element={<Room name={name} socket={socket} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;