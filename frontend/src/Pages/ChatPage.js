import { Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import Sidee from '../Others/Sidee'
import MyGists from '../Others/MyGists'
import Chatee from '../Others/Chatee'
import  { ChatState } from '../Context/ChatProvider' 

 
const ChatPage = () => {
  const { user } = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <div style={{ width: '100%' , color:'chocolate'}}>
      {user && <Sidee  />}
      <Box display={'flex'} justifyContent='space-between' w={'100%'} h='91.5vh' p='10px'>
        {user && <MyGists fetchAgain={fetchAgain} />} 
         {user  && <Chatee fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />} 
      </Box>
    </div>
  )
}

export default ChatPage