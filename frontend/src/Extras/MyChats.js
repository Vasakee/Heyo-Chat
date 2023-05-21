import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import Chatloading from './Chatloading'
import { getSender } from '../Configuration/logic'
import axios from 'axios'
import { ChatState } from '../Context/ChatProvider'
import GroupChatModal from '../Others/GroupChatModal'



const MyChats = () => {
  const [logged, setLogged] = useState()

  const { chats, user, setChats, selectedChat, setSelectedChat } = ChatState()

  const notify = useToast()


  const fetchChats = async () => {
    //console.log(chats)
    try {
      const  response  = await axios.get('/api/chats', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })
      setChats(response.data)
      //console.log(chats)
    } catch (error) {
      console.log(error.message)
      notify({
        title: 'Error Occured!',
        description: 'Failed to load chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    }
  }
  useEffect(() => {
    setLogged(JSON.parse(localStorage.getItem('UserInfo')))
    fetchChats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
     
    <Box
      d={{ base: selectedChat ? "setSelectedChat" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "20px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
       </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="75%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
            <Stack overflowY={'scroll'} >
              {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(logged, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
            <Chatloading />
        )}
      </Box>
        </Box>
  )
}

export default MyChats
