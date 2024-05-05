import { useContext, useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { doGraphQLFetch } from "../graphql/fetch";
import { getWorkoutsByOwner } from "../graphql/queries";
import { Workout } from "../types/Workout";
import { WorkoutContext } from "../WorkoutContext";
import { Spinner } from "react-bootstrap";
import { SearchContext } from "../SearchContext";
import AddWorkoutModal from "./AddWorkoutModal";

const MemberWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { searchResults } = useContext(SearchContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const selectedMember = localStorage.getItem("selectedMember")!;
  const selectedUserId = selectedMember ? JSON.parse(selectedMember).id : null;
  const selectedUserName = selectedMember ? JSON.parse(selectedMember).user_name : null;
  const { setWorkoutId } = useContext(WorkoutContext);

  const fetchWorkouts = async () => {
    setIsLoading(true);
    const data = await doGraphQLFetch(apiURL, getWorkoutsByOwner, {
      owner: selectedUserId,
    });
    setWorkouts(data.workoutsByOwner);
    setIsLoading(false);
  };

  useEffect(() => { 
    if (selectedUserId) {
      fetchWorkouts();
    }
  } , [apiURL, selectedUserId]);

  useEffect(() => {
    setWorkouts(searchResults || []);
  }, [searchResults]);

  const handleWorkoutAdded = () => {
    fetchWorkouts();
  };

  return (
    <div className="home">
      {selectedUserName === JSON.parse(localStorage.getItem("user")!).user_name ? (
        <div className="header">
          <div className="add-workout-button">
          <AddWorkoutModal
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            onWorkoutAdded={handleWorkoutAdded}
          />
          </div>
        </div>
      ) : (
        <div className="headerDiv">
          <h2 className="text-white mb-0">{selectedUserName}'s workouts</h2>
        </div>
      )}
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
                No workouts found.
              </h2>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MemberWorkouts;