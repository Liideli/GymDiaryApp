import { useContext, useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { FaHome, FaSearch, FaUser, FaUserPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { LiaDumbbellSolid } from "react-icons/lia";
import { Form, FormControl, NavbarText } from "react-bootstrap";
import { doGraphQLFetch } from "../graphql/fetch";
import { workoutBySearch } from "../graphql/queries";
import { SearchContext } from "../SearchContext";
import { useLocation } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { FiLogIn, FiLogOut } from "react-icons/fi";

function NavBar() {
  const { user, logout } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const navbarRef = useRef(null);
  const { setSearchResults } = useContext(SearchContext);
  const apiURL = import.meta.env.VITE_API_URL;
  const owner = localStorage.getItem("user")!;
  const ownerId = owner ? JSON.parse(owner).id : null;
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    logout();
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

  const handleClickOutside = (event: MouseEvent) => {
    if (
      navbarRef.current &&
      !(navbarRef.current as HTMLElement).contains(event.target as Node)
    ) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (user) {
        setShowSearchBar(window.innerWidth > 992);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Navbar
      expand="lg"
      bg="dark"
      variant="dark"
      sticky="top"
      expanded={expanded}
      ref={navbarRef}
    >
      <Container>
        <div className="navbar-container">
          <NavbarText
            className="navbar-back-button"
            style={{ width: "70%", textAlign: "left" }}
          >
            <IoIosArrowBack size="2em" onClick={() => navigate(-1)} />
          </NavbarText>
          <Navbar.Brand
            href="/~roopekl/gymdiary/"
            className="oswald-semibold navbar-brand"
          >
            <LiaDumbbellSolid className="dumbbell-icon" size="2em" />
            GymDiary
          </Navbar.Brand>
          <div style={{ width: "30%" }}>
            {user && (
              <NavbarText className="navbar-back-button">
                <FaSearch
                  size="1.5em"
                  style={{ marginRight: "1.2em" }}
                  aria-controls="search-bar"
                  onClick={() => setShowSearchBar(!showSearchBar)}
                />
              </NavbarText>
            )}
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={() => setExpanded(!expanded)}
            />
          </div>
        </div>
        <div className="search-bar">
          {showSearchBar || window.innerWidth > 768
            ? location.pathname !== "/" ||
              (user && (
                <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                  <FormControl
                    type="search"
                    placeholder="search workouts"
                    aria-label="Search"
                    value={searchTerm}
                    style={{ borderRadius: "2em" }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchTerm(e.target.value);
                      debouncedHandleSearch(e.target.value);
                    }}
                  />
                </Form>
              ))
            : null}
        </div>
        <div style={{width: "144em"}}> </div>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                {window.innerWidth <= 768 && (
                <FaHome size="1.2em" style={{ marginRight: "10px" }} />
                )}
                Your Workouts
              </Nav.Link>
            )}
            {!user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={() => setExpanded(false)}
                >
                  {window.innerWidth <= 768 && (
                  <FiLogIn size="1.2em" style={{ marginRight: "10px" }} />
                  )}
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  onClick={() => setExpanded(false)}
                >
                  {window.innerWidth <= 768 && (
                  <FaUserPlus size="1.2em" style={{ marginRight: "10px" }} />
                  )}
                  New Account
                </Nav.Link>

              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/groups"
                  onClick={() => setExpanded(false)}
                >
                  <FaUserGroup size="1.2em" style={{ marginRight: "10px" }} />
                  Groups
                </Nav.Link>
              <Nav.Link
                onClick={() => {
                  handleLogout();
                  setExpanded(false);
                }}
                as={Link}
                to="/login"
              >
                <FiLogOut size="1.2em" style={{ marginRight: "10px" }} />
                Logout
              </Nav.Link>
              </>
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
