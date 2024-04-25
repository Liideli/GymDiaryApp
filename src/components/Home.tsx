import { useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import AddWorkoutModal from "./AddWorkoutModal";
import { useNavigate } from "react-router-dom";
import { doGraphQLFetch } from "../graphql/fetch";
import { getWorkoutsByOwner } from "../graphql/queries";
import { Workout } from "../types/Workout";
import { WorkoutContext } from "../WorkoutContext";
import React from "react";
import { Spinner } from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import ModifyWorkoutModal from "./ModifyWorkoutModal";

const Home = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const owner = localStorage.getItem("user")!;
  const ownerId = owner ? JSON.parse(owner).id : null;
  const { setWorkoutId } = React.useContext(WorkoutContext);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      const data = await doGraphQLFetch(apiURL, getWorkoutsByOwner, {
        owner: ownerId,
      });
      setWorkouts(data.workoutsByOwner);
      setIsLoading(false);
    };
    if (ownerId) {
      fetchWorkouts();
    }
  }, [apiURL, ownerId]);

  return (
    <div className="home">
      <div className="header">
        {ownerId && (
          <AddWorkoutModal
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
          />
        )}
      </div>
      <div className="card-list">
        {isLoading ? (
          <Spinner variant="white" animation="border" role="status" />
        ) : ownerId ? (
          workouts.map((workout) => (
            <Card
              key={workout.id}
              style={{ flex: "1 1 50%", margin: "10px", maxWidth: "300px" }}
              onClick={() => {
                setWorkoutId(workout.id);
                localStorage.setItem("workoutId", JSON.stringify(workout.id));
                navigate(`/exercise/${workout.id}`);
              }}
            >
              <Card.Body>
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  <ListGroup.Item style={{ marginLeft: "1em" }}>
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
              Please login or register to mark down workouts.
            </h2>
          </div>
        )}
      </div>
      {selectedWorkout && (
        <ModifyWorkoutModal
          show={showModifyModal}
          onHide={() => setShowModifyModal(false)}
          workout={selectedWorkout}
        />
      )}
    </div>
  );
};

export default Home;
