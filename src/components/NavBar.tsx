import { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { FaUser } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { LiaDumbbellSolid } from "react-icons/lia";
import { Form, FormControl, NavbarText } from "react-bootstrap";
import { doGraphQLFetch } from "../graphql/fetch";
import { workoutBySearch } from "../graphql/queries";
import { SearchContext } from "../SearchContext";
import { useLocation } from "react-router-dom";

function NavBar() {
  const { user, logout } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const { setSearchResults } = useContext(SearchContext);
  const apiURL = import.meta.env.VITE_API_URL;
  const owner = localStorage.getItem("user")!;
  const ownerId = owner ? JSON.parse(owner).id : null;
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.localStorage.removeItem("workoutId");
  };

  // Function to add delay to reduce API calls on search input
  const debounce = (func: (arg: string) => void, delay: number) => {
    let debounceTimer: NodeJS.Timeout;
    return function (arg: string) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(arg), delay);
    };
  };

  const handleSearch = async (searchTerm: string): Promise<void> => {
    const searchedWorkouts = await doGraphQLFetch(apiURL, workoutBySearch, {
      search: searchTerm,
      owner: ownerId,
    });
    setSearchResults(searchedWorkouts.workoutBySearch);
  };

  const debouncedHandleSearch = debounce(handleSearch, 300);

  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top">
      <Container>
        <NavbarText className="navbar-back-button">
        <IoIosArrowBack size= "2em" onClick={() => navigate(-1)} />
        </NavbarText>
        <Navbar.Brand href="/~roopekl/gymdiary/" className="oswald-semibold">
          <LiaDumbbellSolid className="dumbbell-icon" size="2em" />
          GymDiary
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
            )}
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout} as={Link} to="/login">
                Logout
              </Nav.Link>
            )}
            {user && (
              <Nav.Link as={Link} to="/leaderboard">
                Leaderboard
              </Nav.Link>
            )}
            {location.pathname !== "/" ||
              ownerId && (
                <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                  <FormControl
                    type="search"
                    placeholder="Search workouts"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchTerm(e.target.value);
                      debouncedHandleSearch(e.target.value);
                    }}
                  />
                </Form>
              )}
          </Nav>
          {user && (
            <Navbar.Text className="ml-auto">
              <FaUser size="1.2em" style={{ marginRight: "10px" }} />
              {user.user_name}
            </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
