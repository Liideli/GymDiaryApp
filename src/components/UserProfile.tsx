import { Button, Card, Spinner } from "react-bootstrap";
import { doGraphQLFetch } from "../graphql/fetch";
import { deleteUser } from "../graphql/queries";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const UserProfile = () => {
  const { user, logout } = useContext(UserContext);
  const userProfile = localStorage.getItem("user")!;
  const apiURL = import.meta.env.VITE_API_URL;
  const parsedUser = user ? JSON.parse(userProfile) : null;
  const userId = user ? JSON.parse(userProfile).id : null;
  const token = localStorage.getItem("token")!;
  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    try {
      await doGraphQLFetch(apiURL, deleteUser, { deleteUserId: userId }, token);
      handleLogout();
      toast("User deleted successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("User deletion failed");
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    logout();
  };

  if (!user) {
    <Spinner
      variant="white"
      animation="border"
      role="status"
      className="mt-5"
    />;
  }

  return (
    <div>
      <div className="headerDiv" />
      <div className="card-list">
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>{parsedUser.user_name}</Card.Title>
            <Card.Text>{parsedUser.email}</Card.Text>
            <Button
              variant="danger"
              onClick={() => {
                handleDeleteUser();
              }}
            >
              Delete User
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
