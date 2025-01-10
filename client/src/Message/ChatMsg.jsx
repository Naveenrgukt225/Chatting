import React, { useEffect, useState, useMemo } from 'react';
import { io } from "socket.io-client";
import './FloatLabel.css';

const ChatMsg = () => {
  const [messages, setMessages] = useState([]);  // for receiving messages from others
  const [message, setMessage] = useState("");  // for sending message
  const [room, setRoom] = useState("");  // for sending messages to a particular room
  const [socketID, setSocketId] = useState("");  // to send message to a particular person
  const [roomName, setRoomName] = useState("");  // for joining a room

  // For production, replace with your Vercel backend URL:
  // const socket = useMemo(() => io("http://localhost:3000"), []);
  // //  const socket = useMemo(() => io("https://chatting-group-server.vercel.app"), []); 

  // useEffect(() => {
  //   socket.on("connect", () => {
  //       setSocketId(socket.id);
  //   });

  //   // Listen for the event to receive messages
  //   socket.on("receive-message", (data) => {
  //       setMessages((prevMessages) => [...prevMessages, data.message]);
  //   });

  
  const socket = useMemo(() => io("http://localhost:3001"), []) ;
  useEffect(() => {
    socket.on("connect", () => {
        setSocketId(socket.id);
    });

    socket.on("recive-message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
        socket.disconnect();
    };
  }, [socket]);

  // Join the room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  // Send the message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (room && message) {
        socket.emit("message", { message, room });
        setMessage("");
    }
  };

  return (
    <div className='outer-container'>
      <div className='container'>
        <h4 className='id-field'>{socketID}</h4>
        <br />

        <div className="messages-field">
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>

        <div className='join-label'>
          <form onSubmit={handleJoinRoom}>
            <div className='input-field'>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
              <label htmlFor="join-room">Enter Room Name</label>
            </div>
            <button type='submit'>Join</button>
          </form>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='Inner-field'>
            <div className='input-field'>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                required
              />
              <label htmlFor="room">Enter Room ID</label>
            </div>

            <div className='input-field'>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <label htmlFor="message">Enter Message</label>
            </div>
            <button type='submit'>Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatMsg;
