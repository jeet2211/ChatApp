
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import queryString from "query-string";
import "./ChatStyles.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import UserContainer from "../UserContainer/UserContainer";

import ScrollToBottom from "react-scroll-to-bottom";
let socket;
const NewChatComponent = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const ENDPOINT = "localhost:8000";

  const location = useLocation();

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div>
      <div className="outerWrapper">
        <div className="chatContainer">
          <div className="searchSection" style={{ background: "#333" }}>
            <h1>Chat App</h1>
          </div>

          <div className="conversationList" style={{ background: "#333" }}>
            <UserContainer users={users} />
          </div>

          <div className="newMessageSection" style={{ background: "#333" }}></div>

          <div className="chatHeader">
            <InfoBar room={room} />
          </div>

          <ScrollToBottom className="chatMessageList">
            <Messages messages={messages} name={name} />
          </ScrollToBottom>

          <div className="chatForm">
            <Input
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatComponent;
