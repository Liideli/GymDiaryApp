import React, { useState } from 'react';
import { Form, Button, Container, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { doGraphQLFetch } from '../graphql/fetch';
import { register } from '../graphql/queries';
import { RegisterMessageResponse } from '../types/RegisterMessageResponse';
import { RegisterCredentials } from '../types/RegisterCredentials';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const apiURL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="login-register-container">
      <h1 className="mt-5 oswald-regular text-white">Sign up</h1>
      <Form className="mt-3" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <FloatingLabel
        controlId="floatingInputUsername"
        label="Username"
        className="mb-3"
      >
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <FloatingLabel
        controlId="floatingInputEmail"
        label="Email address"
        className="mb-3"
      >
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <FloatingLabel
        controlId="floatingInputPassword"
        label="Password"
        className="mb-3"
      >
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </FloatingLabel>
        </Form.Group>
        
        <div>
        <div>
          <Button className="button-blue w-100" type="submit">
            Sign up
          </Button>
        </div>
        <div className="mt-4">
          <Button
            className="w-100"
            variant="outline-secondary"
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
        </div>
      </Form>
    </Container>
  );
};

export default Register;
