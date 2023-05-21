import { ArrowBackIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { Box, InputGroup, IconButton, Input, Spinner, Text, InputRightElement, useToast, FormControl } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { getCompleteSender, getSender } from '../Configuration/logic'
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import UpdateGroupChatModal from '../Others/UpdateGroupChatModel'
import axios from 'axios'
import './Messages.css'
import Chat from './Chat'
import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:4000';
var socket, selectedChatCompare; 

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing , setTyping] = useState(false)
    const [istyping , setIsTyping] = useState(false)


    const notify = useToast()

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()

    const handleSendMessage = async () => {
        socket.emit('stop typing', selectedChat._id)
        try {
             setNewMessage('');
            const response = await axios.post('/api/message', {
                content: newMessage,
                chatId: selectedChat._id
            }, { 
                 headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
            })
            //console.log(response.data)
            socket.emit('new message', response.data)
            setMessages([...messages, response.data])
        } catch (error) {
             notify({
        title: 'Error Occured!',
        description: 'could not send message',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
        }
     }
    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
         socket.on('stop typing', () => setIsTyping(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })
    const fetchMessages = async () => {
        if (!selectedChat) return;
            try {
                setLoading(true)
                const  response  = await axios.get(`/api/message/${selectedChat._id}`, {
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                  }
              })
                setMessages(response.data) 
                //console.log(messages)
                setLoading(false)
                socket.emit('join chat', selectedChat._id)
            } catch (error) {
                  notify({
        title: 'Error Occured!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
            } 
    }
    useEffect(() => {
        fetchMessages()
        
        selectedChatCompare = selectedChat
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat])
    

    const handleMessage = (e) => {
        setNewMessage(e.target.value)
        
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()

        setTimeout(() => {
            var timeNow = new Date().getTime() 
            var timeDiff = timeNow - lastTypingTime

            if (timeDiff >= 3000 && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, 3000)
     }
  return (
    < >
          {selectedChat ? (
              <>
                  <Text fontSize={{ base: '28px', md: '30px' }} pb={3} px={2} w='100%' fontFamily={'fantasy'} display={'flex'}
                    justifyContent={{base: 'space-between'}} alignItems='center'
                  >
                      <IconButton display={{ base: 'flex', md: 'none' }}
                          icon={<ArrowBackIcon />}
                          onClick={() => setSelectedChat('')}
                      />
                      {!selectedChat.isGroupChat ? (
                          < >{getSender(user, selectedChat.users)}
                             <ProfileModal user={getCompleteSender(user, selectedChat.users)}/>
                          </>
                      ) : (<>
                              {selectedChat.chatName.toUpperCase()}
                              <UpdateGroupChatModal fetchAgain={fetchAgain}
                                  setFetchAgain={setFetchAgain} fetchMessages= {fetchMessages}
                          />
                      </>)} 
                  </Text>
                  <Box display={'flex'} flexDir={'column'} justifyContent='flex-end' p={3} bg='#E8E8E8' w={'100%'}
                  h='100%' borderRadius={'lg'} overflowY='hidden'>
                      {loading ? (
                          <Spinner size={'xl'} w={20} h={20} alignSelf='center' margin={'auto'} />
                      ) : (
                              <div className='messages'>
                              <Chat messages={messages} />
                              </div>
                      )}
                          <FormControl  >
                           <InputGroup mt={3}>
                          {istyping ? <div>typing...</div> : <> </> }
                          <Input variant={'filled'} bg='#E0E0E0' placeholder='type message here...' color={'black'} value={newMessage} onChange={handleMessage} isRequired />
                          <InputRightElement >
                              <IconButton icon={<ArrowRightIcon />} size='sm' type='submit' onClick={handleSendMessage} disabled={!newMessage} />
                          </InputRightElement>
                      </InputGroup>
                     </FormControl>
                  </Box>
                </>
          ) : (
                  <Box display='flex' alignItems={'center'} justifyContent='center' h={'100%'}>
                      <Text fontSize={'3xl'} pb={3} fontFamily='fantasy'>
                          Click on a user to start Chatting
                      </Text>
                  </Box>
     )} 
    </>
  )
}

export default SingleChat
