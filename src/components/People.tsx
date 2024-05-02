import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { doGraphQLFetch } from "../graphql/fetch";
import { getUsers } from "../graphql/queries";
import { User } from "../types/User";
import { FaMedal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const People = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [, setSelectedUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const userdata = await doGraphQLFetch(apiURL, getUsers, {});
      console.log("userdata", userdata);
      setUsers(userdata.users);
      setIsLoading(false);
    };
    fetchUsers();
  }, [apiURL]);

  return (
    <div className="people">
      <div className="card-list">
      {isLoading ? (
          <Spinner variant="white" animation="border" role="status" />
        ) : (
        users.length > 0 ? (
          [...users]
          .sort((a, b) => b.workoutCount - a.workoutCount)
          .map((user, index) => (
            <Card
            className={`custom-card card ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}
              key={index}
              style={{ flex: "1 1 50%", margin: "10px" }}
              onClick={() => {
                setSelectedUser(user);
                localStorage.setItem("selectedUser", JSON.stringify(user));
                navigate(`/peopleworkouts/${user.user_name}`);
              }}
            >
              <Card.Body>
                <Card.Title>{index === 0 && <FaMedal />}{user.user_name}</Card.Title>
                <Card.Text>{user.workoutCount} workouts</Card.Text>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className="mx-auto">
            <h2 className="mt-5 oswald-regular text-white">
              No Users Found
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;