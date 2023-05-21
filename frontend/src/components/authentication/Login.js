import {Button, FormControl, FormLabel,Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const notify = useToast()
  const navigate = useNavigate()

  const handleClick = () => setShow(!show)
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      notify({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
      })
      setLoading(false)
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        },
      }
      const   data    = await axios.post(
        "/api/users/login", { email, password },
        config
      )
        //console.log(JSON.stringify(data.data))
      notify({
                title: 'Login successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
      })
      localStorage.setItem('Details', JSON.stringify(data.data))
      setLoading(false)
      navigate('/chats')
    } catch (error) {
     // console.log(error)
      notify({
                    title: 'An error occurred',
                    description: error.message,
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
            })
          setLoading(false)
    }
  }
  return (
    <div>
      <VStack spacing='5px'>
         <FormControl id='Email2' isRequired>
              <FormLabel>Email</FormLabel>
              <Input placeholder='Enter email here' value={email} onChange={(e) =>setEmail(e.target.value)} />
          </FormControl>
          <FormControl id='Password2' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                  <Input placeholder='Enter password here' value={password} type={show? 'text':'password'} onChange={(e) => setPassword(e.target.value)} />
                  <InputRightElement width={'4.5rem'} >
                      <Button h='1.75rem' size={'sm'} onClick={handleClick}>
                          {show ? <i className="fa fa-eye-slash" aria-hidden="true"></i>: <i className="fa fa-eye" aria-hidden="true"></i>}
                      </Button>
                  </InputRightElement>
              </InputGroup>
        </FormControl>
        <Button bg={'blue'} width='100%' style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading} >
              Login
        </Button>
    </VStack>
    </div>
  )
}

export default Login
