import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import AddWorkoutModal from "./AddWorkoutModal";
import { useNavigate } from "react-router-dom";
import { doGraphQLFetch } from "../graphql/fetch";
import { getWorkoutsByOwner } from "../graphql/queries";
import { Workout } from "../types/Workout";
import { WorkoutContext } from "../WorkoutContext";
import React from "react";

const Home = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const owner = localStorage.getItem("user")!;
  const ownerId = owner ? JSON.parse(owner).id : null;
  const { setWorkoutId } = React.useContext(WorkoutContext);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await doGraphQLFetch(apiURL, getWorkoutsByOwner, {
        owner: ownerId,
      });
      setWorkouts(data.workoutsByOwner);
    };
    if (ownerId) {
      fetchWorkouts();
    }
  }, [apiURL, ownerId]);

  return (
    <div className="home">
      <div className="header">
      {ownerId && (
      <div className="header">
        <AddWorkoutModal show={showModal} onHide={() => setShowModal(false)} />
      </div>
    )}
      </div>
      <div className="card-list">
      {ownerId ? (
        workouts.map((workout) => (
          <Card
            key={workout.id}
            style={{ flex: '1 1 50%', margin: "10px", maxWidth: '300px' }}
            onClick={() => {
              setWorkoutId(workout.id);
              localStorage.setItem("workoutId", JSON.stringify(workout.id));
              navigate(`/exercise/${workout.id}`)
            }}
          >
            <Card.Body>
              <ListGroup variant="flush">
              <ListGroup.Item><h4>{workout.title}</h4></ListGroup.Item>
            {workout.description && (
              <ListGroup.Item>{workout.description}</ListGroup.Item>
            )}
              <ListGroup.Item>
                <div style={{ backgroundColor: "#D1FAFF", borderRadius: "5px" }}>
                {new Date(workout.date).toLocaleDateString('fi-FI')}
                </div>
              </ListGroup.Item>
            </ListGroup>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="mx-auto">
        <h2 className="mt-5 oswald-regular text-white">Please login or register to mark down workouts.</h2>
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;
