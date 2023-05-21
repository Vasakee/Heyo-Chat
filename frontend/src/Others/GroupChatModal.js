import {Box,Button,Modal, ModalFooter, ModalHeader, ModalOverlay,ModalContent, ModalCloseButton, ModalBody, useDisclosure, useToast, FormControl, Input, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import UserListItem from '../Extras/UserListItem'
import UserBadge from '../Extras/UserBadge'

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)

  const notify = useToast()

  const { user, chats, setChats } = ChatState()
  const handleSearch = async(query) => {
    setSearch(query)
    if (!query) {
      return
    }
    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      }

      const  data  = await axios.get(`/api/users?search=${search}`, config)
     // console.log(data.data)
      setLoading(false)
      setSearchResult(data.data)
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

  const handleDelete = (removeUser) => {
    setSelectedUsers(
      selectedUsers.filter(rem => rem._id !== removeUser._id)
    )
   }
  const handleSubmit = async() => {
    if (!groupChatName || !selectedUsers) {
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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      }
      const   data   = await axios.post('/api/chats/group', {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id))
      }, config)
      //console.log(data.data)
      setChats([data.data, ...chats])
    //  console.log(chats)
      onClose()
      notify({
        title: 'New Group Created',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    } catch (error) {
      console.log(error.message)
      notify({
        title: 'Failed to create group',
        description: error.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    }
  }

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      notify({
        title: 'User already exists',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd])
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'35px'} fontFamily='Work sans' display='flex' justifyContent={'center'}>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir={'column'} alignItems='center'>
            <FormControl >
              <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
            </FormControl>
              <FormControl >
              <Input placeholder='Add users' mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            <Box w='100%' display='flex' flexWrap={'wrap'} >
               {selectedUsers.map((u) => (
              <UserBadge key={user._id} user ={u} handleFunction={() => handleDelete(u)} />
            ))}
           </Box>
            {loading ? (<Spinner />) : (
              searchResult?.slice(0, 4).map(user => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user) } />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button bg={'blue'}  onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
