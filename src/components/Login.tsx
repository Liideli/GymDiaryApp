import React, { useContext, useState } from 'react';
import { Form, Button, Container, FloatingLabel } from 'react-bootstrap';
import { doGraphQLFetch } from '../graphql/fetch';
import { login } from '../graphql/queries';
import { LoginCredentials } from '../types/LoginCredentials';
import { LoginMessageResponse } from '../types/LoginMessageResponse';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const apiURL = import.meta.env.VITE_API_URL;
  
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', username);
    console.log('Password:', password);

    const loginCredentials: LoginCredentials = {
      username: username,
      password: password,
    };

    try {
      const loginData = (await doGraphQLFetch(apiURL, login, {credentials: loginCredentials})) as LoginMessageResponse;
      console.log(loginData);
      localStorage.setItem('token', loginData.login.token!);
      localStorage.setItem('user', JSON.stringify(loginData.login.user));
      setUser(loginData.login.user);
      navigate('/');
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Container className="w-50">
      <h1 className="mt-5 oswald-regular text-white">Login</h1>
      <Form className="mt-3" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <FloatingLabel
            controlId="floatingInputEmail"
            label="Email address"
            className="mb-3"
          >
            <Form.Control type="email" placeholder="Enter email" value={username} onChange={(e) => setUsername(e.target.value)} />
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <FloatingLabel
            controlId="floatingInputPassword"
            label="Password"
            className="mb-3"
          >
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FloatingLabel>
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;