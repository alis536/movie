import React, { useState, useEffect, useRef } from "react";

const Room = ({ name, socket }) => {
    const [roomUsers, setRoomUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const videoRef = useRef(null);

    useEffect(() => {
        socket.emit("enterRoom", name);

        socket.on("updateRoomUsers", (users) => {
            setRoomUsers(users);
        });

        socket.on("receiveMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        socket.on("chatHistory", (history) => {
            setMessages(history);
        });

        // Обработчики для видео
        socket.on("playMovie", () => {
            if (videoRef.current) {
                videoRef.current.play();
            }
        });

        socket.on("pauseMovie", () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        });

        return () => {
            socket.emit("leaveRoom", name);
        };
    }, [socket, name]);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = { sender: name, text: message };
            socket.emit("sendMessage", newMessage);
            setMessage("");
        }
    };

    // Функция запуска фильма
    const startMovie = () => {
        socket.emit("startMovie");
    };

    // Функция остановки фильма
    const pauseMovie = () => {
        socket.emit("pauseMovie");
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Комната</h2>
            <h3>Пользователи в комнате:</h3>
            <h1>
                {roomUsers.map((user, index) => (
                    <p key={index}>{user} <strong style={{ color: '#23ff28' }}>(Online)</strong></p>
                ))}
            </h1>
            <h3>Фильм</h3>
            <video ref={videoRef} width="300" controls>
                <source src="https://kxcdn.ru/Yovuz_Murdaning_Tirilishi_2023_HD_Daxshat.Net.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео.
            </video>
            <br />
            <div className="buttonsRoom" style={{ display: 'flex' }}>
                <button
                    onClick={startMovie}
                    style={{ width: '200px', height: '100px', marginTop: '25px', fontSize: '20px', color: 'black', fontWeight: '700', borderRadius: '10px', border: '3px solid green', cursor: 'pointer' }}>
                    Filimni boshlash
                </button>
                <button
                    onClick={pauseMovie}
                    style={{ width: '200px', height: '100px', marginTop: '25px', fontSize: '20px', color: 'black', fontWeight: '700', borderRadius: '10px', border: '3px solid red', cursor: 'pointer', marginLeft: '10px' }}>
                    FIlimni to'xtatish
                </button>
            </div>
            <h3 style={{ color: 'black', fontSize: '35px' }}>Chat</h3>
            <div style={{ border: "2px solid #ccc", padding: "10px", height: "200px", overflowY: "auto", borderRadius: '20px' }}>
                {messages.map((msg, index) => (
                    <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
                ))}
            </div>
            <div className="chat" style={{display: 'flex'}}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Bror nima yozing"
                    style={{ marginTop: '20px', padding: '15px', borderRadius: '10px', border: '2px solid #ccc' }}
                />
                <button
                    onClick={sendMessage}
                    style={{ width: '120px', height: '50px', marginTop: '25px', fontSize: '15px', color: 'black', fontWeight: '700', borderRadius: '10px', border: '3px solid #ccc', cursor: 'pointer', marginLeft: '10px' }}
                >Отправить</button>
            </div>
        </div>
    );
};

export default Room;
