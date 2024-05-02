import { useContext, useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { doGraphQLFetch } from "../graphql/fetch";
import { getWorkoutsByOwner } from "../graphql/queries";
import { Workout } from "../types/Workout";
import { WorkoutContext } from "../WorkoutContext";
import { Spinner } from "react-bootstrap";
import { SearchContext } from "../SearchContext";

const PeopleWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { searchResults } = useContext(SearchContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const selectedUser = localStorage.getItem("selectedUser");
  const selectedUserId = selectedUser ? JSON.parse(selectedUser).id : null;
  const selectedUserName = selectedUser ? JSON.parse(selectedUser).user_name : null;
  const { setWorkoutId } = useContext(WorkoutContext);


  useEffect(() => { 
    const fetchWorkouts = async () => {
      setIsLoading(true);
      const data = await doGraphQLFetch(apiURL, getWorkoutsByOwner, {
        owner: selectedUserId,
      });
      setWorkouts(data.workoutsByOwner);
      setIsLoading(false);
    };
    if (selectedUserId) {
      fetchWorkouts();
    }
  } , [apiURL, selectedUserId]);

  useEffect(() => {
    setWorkouts(searchResults || []);
  }, [searchResults]);

  return (
    <div className="home">
      <div className="headerDiv">
        <h2 className="text-white mb-0">{selectedUserName}'s workouts</h2>
      </div>
      <div className="card-list">
        {isLoading ? (
          <Spinner variant="white" animation="border" role="status" />
        ) : (
          workouts.length > 0 ? (
            [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((workout) => (
              <Card
                className="custom-card card"
                key={workout.id}
                style={{ flex: "1 1 50%", margin: "10px" }}
                onClick={() => {
                  setWorkoutId(workout.id);
                  localStorage.setItem("workout", JSON.stringify(workout));
                  navigate(`/exercise/${workout.id}`);
                }}
              >
                <Card.Body>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                    <ListGroup.Item>
                      <h4>{workout.title}</h4>
                    </ListGroup.Item>
                  </div>
                  <ListGroup variant="flush">
                    {workout.description && (
                      <ListGroup.Item>{workout.description}</ListGroup.Item>
                    )}
                    <ListGroup.Item>
                      <div
                        style={{
                          backgroundColor: "#D1FAFF",
                          borderRadius: "5px",
                        }}
                      >
                        {new Date(workout.date).toLocaleDateString("fi-FI")}
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="mx-auto">
              <h2 className="mt-5 oswald-regular text-white">
                This user is yet to create any workouts.
              </h2>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PeopleWorkouts;