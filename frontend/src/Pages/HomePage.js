import React from 'react'
import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { Container, Box, Text, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import SignUp from '../components/authentication/SignUp'

const HomePage = () => {

  const navigate = useNavigate()

 useEffect(() => {      
  const user = JSON.parse(localStorage.getItem('Detail'))
       if (user) {
           navigate("/chats")
       }
   }, [navigate])
  return (
    <Container>
      <Box  display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px">
       <Text fontSize='4xl'fontFamily='-moz-initial'position={'initial'}  >HEYO!</Text>
      </Box>
      <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
        <Tabs variant='soft-rounded' >
  <TabList mb='1em'>
    <Tab width='50%'>Login</Tab>
    <Tab width='50%'>Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <div><Login /></div>
    </TabPanel>
    <TabPanel>
      <div><SignUp /></div>
    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
