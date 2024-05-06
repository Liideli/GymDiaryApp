import React, { useContext, useState } from "react";
import { Form, Button, Container, FloatingLabel } from "react-bootstrap";
import { doGraphQLFetch } from "../graphql/fetch";
import { login } from "../graphql/queries";
import { LoginCredentials } from "../types/LoginCredentials";
import { LoginMessageResponse } from "../types/LoginMessageResponse";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL;

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginCredentials: LoginCredentials = {
      user_name: username,
      password: password,
    };

    try {
      const loginData = (await doGraphQLFetch(apiURL, login, {
        credentials: loginCredentials,
      })) as LoginMessageResponse;
      localStorage.setItem("token", loginData.login.token!);
      localStorage.setItem("user", JSON.stringify(loginData.login.user));
      setUser(loginData.login.user);
      navigate("/");
    } catch (error) {
      toast.error("Invalid username and/or password");
      setIsInvalid(true);
      setPassword("");
      console.error(error);
    }
  };

  return (
    <Container className="login-register-container">
      <h1
        className="mt-5 oswald-regular text-white"
        style={{ color: "#D1FAFF" }}
      >
        Login
      </h1>
      <Form className="mt-3" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <FloatingLabel
            controlId="floatingInputEmail"
            label="Email address"
            className="mb-3"
          >
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <FloatingLabel
            controlId="floatingInputPassword"
            label="Password"
            className="mb-3"
          >
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={isInvalid ? "is-invalid" : ""}
              autoComplete="current-password"
            />
          </FloatingLabel>
        </Form.Group>
        <div>
        <div>
          <Button className="button-blue w-100" type="submit">
            Login
          </Button>
        </div>
        <div className="mt-4">
          <Button
            className="w-100"
            variant="outline-secondary"
            type="button"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
