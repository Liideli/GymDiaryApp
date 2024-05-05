import { useContext, useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import AddWorkoutModal from "./AddWorkoutModal";
import { useNavigate } from "react-router-dom";
import { doGraphQLFetch } from "../graphql/fetch";
import { getWorkoutsByOwner } from "../graphql/queries";
import { Workout } from "../types/Workout";
import { WorkoutContext } from "../WorkoutContext";
import { Spinner } from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import ModifyWorkoutModal from "./ModifyWorkoutModal";
import { SearchContext } from "../SearchContext";


const Home = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { searchResults } = useContext(SearchContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const owner = localStorage.getItem("user")!;
  const ownerId = owner ? JSON.parse(owner).id : null;
  const { setWorkoutId } = useContext(WorkoutContext);

  const fetchWorkouts = async () => {
    setIsLoading(true);
    const data = await doGraphQLFetch(apiURL, getWorkoutsByOwner, {
      owner: ownerId,
    });
    setWorkouts(data.workoutsByOwner);
    setIsLoading(false);
  };

  useEffect(() => { 
    if (ownerId) {
      fetchWorkouts();
    }
  }, []);

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

  return (
    <div className="home">
      <div className="header">
        {ownerId && (
          <div className="add-workout-button">
          <AddWorkoutModal
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            onWorkoutAdded={handleWorkoutAdded}
          />
        </div>
        )}
      </div>
      <div className="card-list">
      {selectedWorkout && (
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
        ) : ownerId ? (
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
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
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
                    <ListGroup.Item>
                      <h4>{workout.title}</h4>
                    </ListGroup.Item>
                    <div style={{width: "2em"}}>{" "}</div>
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
                No workouts yet. Add one by clicking plus button.
              </h2>
            </div>
          )
        ) : (
          <div className="mx-auto">
            <h2 className="mt-5 oswald-regular text-white">
              Please login or register to mark down workouts.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
