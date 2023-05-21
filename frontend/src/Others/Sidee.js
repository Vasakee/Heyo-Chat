import React, { useState } from 'react'
import {
  Avatar, Box, Button, Input, Menu, MenuButton, MenuDivider, MenuList, MenuItem, Text, Tooltip, Drawer, useDisclosure,
  DrawerOverlay, DrawerHeader, DrawerContent, DrawerBody, useToast, Spinner
} from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from '../Extras/ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Chatloading from '../Extras/Chatloading'
import UserListItem from '../Extras/UserListItem'
import { getSender } from '../Configuration/logic'


const Sidee = () => {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()

  const {isOpen, onOpen, onClose} = useDisclosure()
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
  const navigate = useNavigate()
  
  const LogoutHandler = () => {
    localStorage.removeItem('Details')
    navigate('/')
  }

  const notify = useToast()

  const handleSearch = async() => {
    if (!search) {
      notify({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
      return
    }
    
    try {
      setLoading(true)
      //console.log(user)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      };
      const  data   = await axios.get(`/api/users?search=${search}`, config)
      setLoading(false)
      setSearchResult(data.data)
      //console.log(data.data)
    } catch (error) {
      notify({
        title: 'Error Occured!',
        description: 'failed to load Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
       
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
      };
      const   { data }   = await axios.post(`/api/chats`, { userId }, config)
      if (!chats.find((c) => c._id === data._id))  setChats([data, ...chats])
      setSelectedChat(data)
      //console.log(data)
      setLoadingChat(false)
      onClose()
    } catch (error) {
       console.log(error.message)
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
  return (
    <div>
      <Box display={'flex'} justifyContent='space-between' alignItems={'center'} bg='white' w={'100%'} p='5px 10px 5px 10px' borderWidth={'5px'}>
        <Tooltip label='Search Users to Chat' hasArrow  placement='top-end'>
          <Button variant={'ghost'} onClick={onOpen}>
            <i className="fa fa-search" aria-hidden="true"></i>
            <Text display={{base:'none', md:'flex'}} px='4'>Search User</Text>
         </Button>
        </Tooltip>
        <Text fontSize={'2xl'} fontFamily='monospace'>
          HEYO CHAT!
      </Text>
      <div>
        <Menu>
          <MenuButton p={1}>
              <BellIcon fontSize={'2xl'} m={1} />
          </MenuButton>
            <MenuList>
              {!notification.length && 'No new Messages'}
              {notification.map((note) => (
                <MenuItem key={note._id} onClick={() => {
                  setSelectedChat(note.chat)
                   setNotification(notification.filter((n) => n !== note))
                }} >
                  {note.chat.isGroupChat ? `new Message from ${note.chat.chatName}` : `new Message from ${getSender(user, note.chat.users)}`}
                </MenuItem>
              ))}</MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={'sm'} cursor='pointer' name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={LogoutHandler}>Logout</MenuItem>
            </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={'1px'}>Search Users </DrawerHeader>
        <DrawerBody>
          <Box d='flex' pb={2}>
            <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
             <Button variant={'ghost'} onClick={handleSearch}>
            <i className="fa fa-search" aria-hidden="true"></i>
         </Button>
          </Box>
          {loading ? (
            <Chatloading />
          ) : (
                searchResult?.map(user => (
               <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
             ))
            )}
            {loadingChat && <Spinner ml='auto' d='flex' />}
          </DrawerBody>
          </DrawerContent>
    </Drawer>
    </div>
  )
}

export default Sidee
