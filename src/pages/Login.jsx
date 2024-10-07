import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Heading, VStack, Button, Checkbox, FormControl, FormLabel, Input, useToast, Tabs, TabList, Tab, TabPanels, TabPanel, Text } from '@chakra-ui/react';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const AuthForm = ({ isLogin, onSubmit, isLoading }) => (
  <form onSubmit={onSubmit}>
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" name="email" required />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="password" name="password" required />
      </FormControl>
      {!isLogin && (
        <>
          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input type="text" name="fullName" required />
          </FormControl>
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" name="phoneNumber" required />
          </FormControl>
        </>
      )}
      <Button type="submit" colorScheme={isLogin ? "blue" : "green"} width="full" isLoading={isLoading}>
        {isLogin ? "Login" : "Sign Up"}
      </Button>
    </VStack>
  </form>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, login, signup } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (session) {
      const from = location.state?.from || '/booking';
      navigate(from);
    }
  }, [session, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const fullName = formData.get('fullName');
        const phoneNumber = formData.get('phoneNumber');
        await signup(email, password, { fullName, phoneNumber });
        toast({
          title: "Account created",
          description: "You can now log in with your new account",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: isLogin ? "Login failed" : "Signup failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="#EBECF0" minHeight="calc(100vh - 60px)" py={10}>
      <Container maxW="md">
        <VStack spacing={8} align="stretch" bg="#EBECF0" p={8} borderRadius="md" boxShadow="md">
          <Heading as="h1" size="xl" textAlign="center" color="#61677C" textShadow="1px 1px 1px #FFF">Account</Heading>
          <Tabs isFitted variant="enclosed" index={isLogin ? 0 : 1} onChange={(index) => setIsLogin(index === 0)}>
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <AuthForm isLogin={true} onSubmit={handleSubmit} isLoading={isLoading} />
              </TabPanel>
              <TabPanel>
                <AuthForm isLogin={false} onSubmit={handleSubmit} isLoading={isLoading} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;