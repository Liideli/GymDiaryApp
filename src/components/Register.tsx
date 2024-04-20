import React, { useContext, useState } from 'react';
import { Form, Button, Container, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { doGraphQLFetch } from '../graphql/fetch';
import { register } from '../graphql/queries';
import { RegisterMessageResponse } from '../types/RegisterMessageResponse';
import { RegisterCredentials } from '../types/RegisterCredentials';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const apiURL = import.meta.env.VITE_API_URL;


  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    const registerCredentials: RegisterCredentials = {
      email: email,
      user_name: username,
      password: password,
    };

    try {
      const registerData = await doGraphQLFetch(apiURL, register, { user: registerCredentials }) as RegisterMessageResponse;
      
      if (!registerData || !registerData.register) {
        throw new Error('Registration failed');
      }

      console.log(registerData);
      setUser(registerData.register.user);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="w-50">
      <h1 className="mt-5 oswald-regular text-white">Register</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <FloatingLabel
        controlId="floatingInput"
        label="Username"
        className="mb-3"
      >
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <FloatingLabel
        controlId="floatingInput"
        label="Email address"
        className="mb-3"
      >
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <FloatingLabel
        controlId="floatingInput"
        label="Password"
        className="mb-3"
      >
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FloatingLabel>
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
