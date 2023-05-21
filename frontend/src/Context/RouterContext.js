import React, { createContext, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

export const RouterContext = createContext(null);

function RouterContextProvider({ children }) {
     const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState()
  const [chats, setChats] = useState([])
  return (
    <BrowserRouter>
          <RouterContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats}}>
              {children}
      </RouterContext.Provider>
    </BrowserRouter>
  )
}

export default RouterContextProvider
