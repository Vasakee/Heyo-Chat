import { ViewIcon } from '@chakra-ui/icons'
import {
  IconButton, useDisclosure, Modal, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, Text, Button, ModalOverlay, Image
} from '@chakra-ui/react'
import React from 'react'


const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {children ? (
        <span onClick={onOpen}>
          {children}
        </span>) : (
          <IconButton display={{ base: 'flex' }}
            icon={<ViewIcon />} onClick={onOpen} />
        )
      }
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} fontFamily='heading' justifyContent={'center'} fontSize='40px'>
            {user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDirection='column' alignItems={'center'} justifyContent='space-between'>
            <Image src={user.profilepic} alt={user.name} borderRadius='full' boxSize='150px' />
            <Text fontSize={{base:'28px', md: '30px'}} fontFamily='serif'>
              Email:{user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal
