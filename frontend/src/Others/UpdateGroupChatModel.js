import { ViewIcon } from '@chakra-ui/icons'
import {
    Button, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    useToast, Box, FormControl, Input, Spinner
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import UserBadge from '../Extras/UserBadge'
import axios from 'axios'
import UserListItem from '../Extras/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState([])
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const { selectedChat, setSelectedChat, user } = ChatState()

    const notify = useToast()

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            notify({
                title: 'Only admin can remove someone',
                status: 'error',
                duration: 5000,
                position: 'top-right',
                isClosable: true,
            })
        }
        try {
            setLoading(true)
            const response = await axios.put('/api/chats/removeFromGroup', {
                chatId: selectedChat._id,
                userId: user1._id
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
            user1._id === user._id ? setSelectedChat() : setSelectedChat(response.data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
        } catch (error) {
            notify({
                title: 'An Error Occured',
                description: error.message,
                status: 'error',
                duration: 5000,
                position: 'top-right',
                isClosable: true,
            })
            setLoading(false)
        }

    }

    const handleAdd = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1.id)) {
             notify({
                title: 'User already in the group',
                status: 'error',
                duration: 5000,
                position: 'top-right',
                isClosable: true,
             })
        }
        if (selectedChat.groupAdmin._id !== user._id) {
             notify({
                title: 'Only admin can add someone',
                status: 'error',
                duration: 5000,
                position: 'top-right',
                isClosable: true,
            })
        }
        try {
            setLoading(true)
             const response = await axios.put('/api/chats/addTogroup', {
                chatId: selectedChat._id,
                userId: user1._id
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
             })
            setSelectedChat(response.data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            notify({
                title: 'An Error Occured',
                description: error.message,
                status: 'error',
                duration: 5000,
                position: 'top-right',
                isClosable: true,
            })
            setLoading(false)
        }
    }

    const handleRename = async() => {
        if (!groupChatName) return
        
        try {
            setRenameLoading(true)
            const response = await axios.put('/api/chats/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
            setSelectedChat(response.data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        }
        catch (error) {
            notify({
                title: 'An Error Occured',
                description: error.message,
                status: 'error',
                duration: 5000,
                position: 'top-right',
                isClosable: true,
            })
            setRenameLoading(false)
        }
        setGroupChatName('')
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
      setLoading(true)

      const  data  = await axios.get(`/api/users?search=${search}`, {headers: {
          Authorization: `Bearer ${user.token}`
        }} )
      //console.log(data.data)
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
            setLoading(false)
    }
    }

  return (

      <>
      <IconButton onClick={onOpen} display={{base: 'flex'}} icon={<ViewIcon />} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
                  <ModalHeader fontSize={'35px'} fontFamily='Work sans'
                      display={'flex'} justifyContent='center' 
                  >
                      {selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
                  <ModalBody>
                      <Box w={'100%'} display='flex' flexWrap={'wrap'} pb={3}>
                          {selectedChat.users.map((u) => (
                              <UserBadge key={user._id}
                                  user={u}
                                  handleFunction= {() => handleRemove(u)}
                              />
                          ))}
                      </Box>
                      <FormControl display={'flex'} >
                          <Input placeholder='Chat Name' mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                          <Button variant={'solid'} colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename} >
                              Update
                          </Button>
                      </FormControl>
                       <FormControl >
                        <Input placeholder='Add users' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                      </FormControl>
                      {loading ? (<Spinner />) : (
              searchResult?.slice(0, 4).map(user => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleAdd(user) } />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>


  )
}

export default UpdateGroupChatModal
