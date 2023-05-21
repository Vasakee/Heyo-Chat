import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState()
  const [chats, setChats] = useState([])
  const [notification, setNotification] = useState([])

  const navigate = useNavigate();


  useEffect(() => {
    const Information = JSON.parse(localStorage.getItem('Details'))
    setUser(Information)
    console.log(Information)
    if (!Information) {
      navigate('/')
    }
  },[navigate])
  

  return (
    <ChatContext.Provider
      value={{ chats, setChats, user, setUser, selectedChat, setSelectedChat, notification, setNotification}}> 
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;