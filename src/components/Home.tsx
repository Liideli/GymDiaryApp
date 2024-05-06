import { useContext, useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import AddWorkoutModal from "./AddWorkoutModal";
import { useNavigate } from "react-router-dom";
import { doGraphQLFetch } from "../graphql/fetch";
import { getWorkoutsByUser } from "../graphql/queries";
import { Workout } from "../types/Workout";
import { WorkoutContext } from "../WorkoutContext";
import { Spinner } from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import ModifyWorkoutModal from "./ModifyWorkoutModal";
import { SearchContext } from "../SearchContext";


const Home = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { searchResults } = useContext(SearchContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const user = localStorage.getItem("user")!;
  const userId = user ? JSON.parse(user).id : null;
  const token = localStorage.getItem("token")!;
  const { setWorkoutId } = useContext(WorkoutContext);


  const fetchWorkouts = async () => {
    const data = await doGraphQLFetch(apiURL, getWorkoutsByUser, {
      owner: userId,
    }, token);
    setWorkouts(data.workoutsByUser);
    setIsLoading(false);
  };

  useEffect(() => { 
    if (token) {
      fetchWorkouts();
    }
    else {
      navigate("/login");
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
      <div className="header">
        {userId && (
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
        ) : userId && (
          workouts && workouts.length > 0 ? (
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
                No workouts yet. Add one by clicking the plus button.
              </h2>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
