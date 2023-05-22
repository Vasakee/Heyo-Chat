import { Button, FormControl, FormLabel, Input,  InputGroup, InputRightElement,  VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const [loading, setloading] = useState(false)
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const notify = useToast()
    const navigate = useNavigate()

    const handleClick = () => setShow(!show)
    const handleClick2 = () => setShow2(!show2)

    const UploadPics = (Picture) => {

        setloading(true)
        if (Picture === undefined) {
            notify({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
            return;
        }
        if (Picture.type === "image/jpg" || Picture.type === "image/png" || Picture.type === "image/jpeg") {
           
            const data = new FormData()
            data.append('file', Picture)
            data.append('upload_preset', 'Heyyochat!')
            data.append('cloud_name', 'dtzvbij00');
            fetch("https://api.cloudinary.com/v1_1/dtzvbij00/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setProfilePic(data.url.toString())
                    console.log(data.url.toString())
                    setloading(false)
                })
                .catch((err) => {
                    console.log(err)
                    setloading(false)
            })
        } else {
            notify({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
            setloading(false)
            return;
        }
    }
    const submitHandler = async () => {
        setloading(true)
        if (!name || !email || !password || !confirmPassword) {
            notify({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
            setloading(false)
            return;
        }
        if (password !== confirmPassword) {
            notify({
                title: 'passwords do not correspond',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
            setloading(false)
            return;
        }
       // console.log(name, email, password)
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
            }
            const data = await axios.post(
                '/api/users', { name, email, password, profilePic }, config
            )
            notify({
                title: 'account created successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
            localStorage.setItem('Details', JSON.stringify(data.data))
            console.log(data.data.profilePic)
            setloading(false)
            navigate('/chats')
        } catch (error) {
            console.log(error)
            notify({
                title: 'An error occured',
                description: error.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            })
            setloading(false)
        } 
    }
  return (
      <VStack spacing='5px'>
          <FormControl id='first-Name' isRequired>
              <FormLabel>Name</FormLabel>
              <Input placeholder='Enter Name here' value={name} onChange={(e) =>setName(e.target.value)} />
          </FormControl>
          <FormControl id='Email' isRequired>
              <FormLabel>Email</FormLabel>
              <Input placeholder='Enter email here' value={email} onChange={(e) =>setEmail(e.target.value)} />
          </FormControl>
          <FormControl id='Password' isRequired>
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
           <FormControl id='confirmPassword' isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                  <Input placeholder='Enter password here' value={confirmPassword} type={show2 ? 'text' : 'password'} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <InputRightElement width={'4.5rem'} >
                      <Button h='1.75rem' size='sm' onClick={handleClick2}>
                       {show2 ? <i className="fa fa-eye-slash" aria-hidden="true"></i>: <i className="fa fa-eye" aria-hidden="true"></i>}
                      </Button>
                  </InputRightElement>
              </InputGroup>
          </FormControl>
          <FormControl id='pic' >
              <FormLabel>Upload Profile Picture</FormLabel>
              <InputGroup>
                  <Input type='file' p={1.5} accept='image/*'  onChange={(e) => UploadPics(e.target.files[0])}  />
              </InputGroup>
  </FormControl>
          <Button bg={'teal'} width='100%' style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}  >
              Sign Up
              </Button>
    </VStack>
  )
}

export default SignUp
