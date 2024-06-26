import { useContext, useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { doGraphQLFetch } from "../graphql/fetch";
import { getWorkoutsByOwner } from "../graphql/queries";
import { Workout } from "../types/Workout";
import { WorkoutContext } from "../WorkoutContext";
import { Spinner } from "react-bootstrap";
import { SearchContext } from "../SearchContext";
import AddWorkoutModal from "./AddWorkoutModal";
import { FaPen, FaUser } from "react-icons/fa";
import ModifyWorkoutModal from "./ModifyWorkoutModal";

const MemberWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { searchResults } = useContext(SearchContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token")!;
  const selectedMember = localStorage.getItem("selectedMember")!;
  const selectedUserId = selectedMember ? JSON.parse(selectedMember).id : null;
  const selectedUserName = selectedMember
    ? JSON.parse(selectedMember).user_name
    : null;
  const { setWorkoutId } = useContext(WorkoutContext);

  const fetchWorkouts = async () => {
    setIsLoading(true);
    const data = await doGraphQLFetch(apiURL, getWorkoutsByOwner, {
      owner: selectedUserId,
    }, token);
    setWorkouts(data.workoutsByOwner);
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchWorkouts();
    }
  }, [apiURL, selectedUserId]);

  useEffect(() => {
    setWorkouts(searchResults || []);
  }, [searchResults]);

  const handleWorkoutAdded = () => {
    fetchWorkouts();
  };

  const handleWorkoutModified = () => {
    fetchWorkouts();
  };

  const handleWorkoutDeleted = () => {
    fetchWorkouts();
  };

  const getColorForDay = (date: Date) => {
    switch (date.getDay()) {
      case 0:
        return "#EF946C"; // Sunday
      case 1:
        return "#6088D2"; // Monday
      case 2:
        return "#FF5733"; // Tuesday
      case 3:
        return "#9E7ACD"; // Wednesday
      case 4:
        return "#A99A89"; // Thursday
      case 5:
        return "#FFC300"; // Friday
      case 6:
        return "#DAF7A6"; // Saturday
      default:
        return "#EF946C";
    }
  };

  return (
    <div className="home">
      {selectedUserName ===
      JSON.parse(localStorage.getItem("user")!).user_name ? (
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
        {selectedWorkout &&
          selectedUserName ===
            JSON.parse(localStorage.getItem("user")!).user_name && (
            <ModifyWorkoutModal
              show={showModifyModal}
              onHide={() => setShowModifyModal(false)}
              workout={selectedWorkout}
              onWorkoutModified={handleWorkoutModified}
              onWorkoutDeleted={handleWorkoutDeleted}
            />
          )}
        {isLoading ? (
          <Spinner variant="white" animation="border" role="status" className="mt-5" />
        ) : workouts.length > 0 ? (
          [...workouts]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((workout) => (
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    {selectedUserName ===
                      JSON.parse(localStorage.getItem("user")!).user_name && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedWorkout(workout);
                          setShowModifyModal(true);
                        }}
                      >
                        <FaPen />
                      </Button>
                    )}
                    <ListGroup.Item>
                      <h4>{workout.title}</h4>
                    </ListGroup.Item>
                    {selectedUserName !==
                    JSON.parse(localStorage.getItem("user")!).user_name ? (
                      <Card.Text>
                        <FaUser style={{marginRight: "0.2em"}}/>
                        {selectedUserName}
                      </Card.Text>
                    ) : (
                      <div style={{ width: "2em" }}> </div>
                    )}
                  </div>
                  <ListGroup variant="flush">
                    {workout.description && (
                      <ListGroup.Item>{workout.description}</ListGroup.Item>
                    )}
                    <ListGroup.Item>
                      <div
                        style={{
                          backgroundColor: getColorForDay(
                            new Date(workout.date)
                          ),
                          borderRadius: "0.5em",
                        }}
                      >
                        {new Date(workout.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            ))
        ) : (
          <div className="mx-auto">
            <h2 className="m-5 oswald-regular text-white">
              No workouts found.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberWorkouts;
