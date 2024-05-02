import { useState } from "react";
import { Form, Button, Container, FloatingLabel } from "react-bootstrap";
import { modifyUser } from "../graphql/queries";
import { doGraphQLFetch } from "../graphql/fetch";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const apiURL = import.meta.env.VITE_API_URL;
  const user = localStorage.getItem("user")!;
  const userId = user ? JSON.parse(user).id : null;


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== verifyPassword) {
      alert("Passwords don't match");
      return;
    } else {
      try {
        const updateUser = await doGraphQLFetch(apiURL, modifyUser, {
          user: {
            user_name: username,
            email: email,
            password: password
          },
          modifyUserId: userId,
        });
        console.log("updated", updateUser);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container className="w-75">
      <h1 className="mt-5 oswald-regular text-white">Modify Profile</h1>
      <Form className="login-register-container mt-3" onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <FloatingLabel
            controlId="floatingInputUsername"
            label="Username"
            className="mb-3"
          >
            <Form.Control
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="formEmail">
          <FloatingLabel controlId="floatingEmail" label="Email" className="mb-5">
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="formVerifyPassword">
          <FloatingLabel
            controlId="floatingVerifyPassword"
            label="Verify Password"
            className="mb-3"
          >
            <Form.Control
              type="password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              autoComplete="current-password"
            />
          </FloatingLabel>
        </Form.Group>

        <Button variant="primary" type="submit">
          Confirm
        </Button>
      </Form>
    </Container>
  );
};

export default UserProfile;
