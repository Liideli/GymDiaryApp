import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { FaUser } from 'react-icons/fa';
import { LiaDumbbellSolid } from'react-icons/lia';


function NavBar() {
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    window.localStorage.removeItem('workoutId');
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="/" className='oswald-semibold'><LiaDumbbellSolid className="dumbbell-icon" size="2em" />GymDiary</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout} as={Link} to="/login">Logout</Nav.Link>
            )}
          </Nav>
        {user && <Navbar.Text className='ml-auto'><FaUser size="1.2em" style={{ marginRight: '10px' }} />{user.user_name}</Navbar.Text>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;