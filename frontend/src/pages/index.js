// In frontend/src/pages/index.js

import { useState } from 'react';
import { Box, Button, FormControl, Input, Heading, useToast, Link, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

export default function Login() {
  // Use 'username' to match the backend model. The label can say "Kisan ID".
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();

  // This function now calls your backend API
  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: 'Error',
        description: "Please fill all fields!",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      // The API call to your running FastAPI backend
      await axios.post('http://127.0.0.1:8000/login', {
        username: username, // 'username' is what the backend expects
        password: password,
      });
      
      toast({
        title: 'Login Successful',
        description: "Welcome to your dashboard.",
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      router.push('/dashboard'); // Redirect to dashboard
    } catch (error) {
       toast({
        title: 'Login Failed',
        description: error.response?.data?.detail || 'Invalid credentials.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {/* Animated background elements from your CSS */}
      <Box className="sun" />
      <Box className="satellite" />
      <Box className="scan-beam" />

      {/* Login Card using Chakra UI components */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="rgba(255, 255, 255, 0.85)"
        backdropFilter="blur(8px)" // This adds the nice glassy effect
        borderRadius="20px"
        p="30px"
        w="320px"
        boxShadow="0 6px 20px rgba(0, 0, 0, 0.3)"
        zIndex="10"
        textAlign="center"
      >
        <Heading as="h2" size="lg" color="#0c520f" mb="10px">
          FASAL DRISHTI
        </Heading>
        <Heading as="h3" size="md" color="#096d0e" mb="25px">
          LOGIN
        </Heading>

        <FormControl>
          <Input
            id="kisanId"
            placeholder="Enter Kisan ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            mb="10px"
            bg="white"
            focusBorderColor="#4CAF50"
            borderRadius="8px"
            _hover={{ borderColor: "#A5D6A7" }}
          />
        </FormControl>

        <FormControl>
          <Input
            id="password"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb="10px"
            bg="white"
            focusBorderColor="#4CAF50"
            borderRadius="8px"
            _hover={{ borderColor: "#A5D6A7" }}
          />
        </FormControl>

        <Button
          onClick={handleLogin}
          bg="#388E3C"
          color="white"
          width="100%"
          mt="10px"
          borderRadius="8px"
          fontSize="16px"
          _hover={{ bg: '#2E7D32', transform: 'scale(1.02)' }}
        >
          Submit
        </Button>

        <Text mt="15px" fontSize="12px" color="black">
          Don't have an account?{' '}
          <NextLink href="/register" passHref>
            <Link color="teal.500" fontWeight="bold">Register</Link>
          </NextLink>
        </Text>
      </Box>
    </>
  );
}