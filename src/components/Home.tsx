import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import AddWorkoutModal from "./AddWorkoutModal";
import { useNavigate } from "react-router-dom";
import { doGraphQLFetch } from "../graphql/fetch";
import { getWorkoutsByOwner } from "../graphql/queries";
import { Workout } from "../types/Workout";

const Home = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const owner = localStorage.getItem("user")!;
  const ownerId = owner ? JSON.parse(owner).id : null;

  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await doGraphQLFetch(apiURL, getWorkoutsByOwner, {
        owner: ownerId,
      });
      console.log("workouts", data);
      setWorkouts(data.workoutsByOwner);
    };
    if (ownerId) {
      fetchWorkouts();
    }
  }, []);

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
            style={{ width: "20%", margin: "10px" }}
            onClick={() => navigate(`/exercise/${workout.id}`)}
          >
            <Card.Body>
              <Card.Title>{workout.title}</Card.Title>
              <Card.Text>{workout.description}</Card.Text>
              <Card.Text>
                {new Date(workout.date).toLocaleDateString()}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="mx-auto">
        <h2>Please login or register to mark down workouts.</h2>
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;
