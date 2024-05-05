import { useContext, useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import AddExerciseModal from "./AddExerciseModal";
import { doGraphQLFetch } from "../graphql/fetch";
import { getExercisesByWorkout } from "../graphql/queries";
import WorkoutContext from "../WorkoutContext";
import { ExerciseType } from "../types/Exercise";
import ModifyExerciseModal from "./ModifyExerciseModal";
import { Spinner } from "react-bootstrap";

const Exercise = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>();
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const apiURL = import.meta.env.VITE_API_URL;
  const owner = localStorage.getItem("user")!;
  const ownerId = owner ? JSON.parse(owner).id : null;
  const contextWorkout = useContext(WorkoutContext);
  const savedWorkout = JSON.parse(window.localStorage.getItem("workout")!);
  const savedWorkoutId = savedWorkout?.id;

  const workoutId = contextWorkout.workoutId || savedWorkoutId;

  const fetchExercises = async () => {
    setIsLoading(true);
    const data = await doGraphQLFetch(apiURL, getExercisesByWorkout, {
      workout: workoutId,
    });
    setExercises(data.exercisesByWorkout);
    setIsLoading(false);
  };

  useEffect(() => {
    if (workoutId && ownerId) {
      fetchExercises();
    }
  }, [apiURL, ownerId, workoutId]);

  const handleExerciseAdded = () => {
    fetchExercises();
  };

  const handleExerciseModified = () => {
    fetchExercises();
  };

  const handleExerciseDeleted = () => {
    fetchExercises();
  };

  return (
    <div className="exercise">
      <div className="header">
        {ownerId === savedWorkout.owner.id && (
          <div className="add-workout-button">
            <AddExerciseModal
              show={showModal}
              onHide={() => setShowModal(false)}
              onExerciseAdded={handleExerciseAdded}
            />
          </div>
        )}
      </div>
      {selectedExercise && (
        <ModifyExerciseModal
          show={showModal}
          onHide={() => setShowModal(false)}
          exercise={selectedExercise}
          onExerciseModified={handleExerciseModified}
          onExerciseDeleted={handleExerciseDeleted}
        />
      )}
      <div className="card-list">
        {isLoading ? (
          <Spinner variant="white" animation="border" role="status" className="mt-5" />
        ) : exercises.length > 0 ? (
          [...exercises].reverse().map((exercise) => (
            <Card
              className="custom-card-exercise"
              key={exercise.id}
              style={{
                flex: "1 1 50%",
                margin: "10px",
                maxWidth: "300px",
                backgroundColor: "#ECEF80",
              }}
              onClick={() => {
                setSelectedExercise(exercise);
                if (ownerId === exercise.owner) {
                  setShowModal(true);
                }
              }}
            >
              <Card.Body>
                <Card.Title>{exercise.name}</Card.Title>
                <ListGroup variant="flush">
                  {exercise.description && (
                    <ListGroup.Item
                      style={{
                        backgroundColor: "#ECEF80",
                        borderColor: "#303030",
                      }}
                    >
                      {exercise.description}
                    </ListGroup.Item>
                  )}
                  {exercise.duration !== 0 && exercise.duration !== null && (
                    <ListGroup.Item
                      style={{
                        textAlign: "left",
                        backgroundColor: "#ECEF80",
                        borderColor: "#303030",
                      }}
                    >
                      <strong>Duration:</strong> {exercise.duration} seconds
                    </ListGroup.Item>
                  )}
                  {exercise.reps !== 0 && exercise.reps !== null && (
                    <ListGroup.Item
                      style={{
                        textAlign: "left",
                        backgroundColor: "#ECEF80",
                        borderColor: "#303030",
                      }}
                    >
                      <strong>Reps:</strong> {exercise.reps}
                    </ListGroup.Item>
                  )}
                  {exercise.sets !== 0 && exercise.sets !== null && (
                    <ListGroup.Item
                      style={{
                        textAlign: "left",
                        backgroundColor: "#ECEF80",
                        borderColor: "#303030",
                      }}
                    >
                      <strong>Sets:</strong> {exercise.sets}
                    </ListGroup.Item>
                  )}
                  {exercise.weight !== 0 && exercise.weight !== null && (
                    <ListGroup.Item
                      style={{
                        textAlign: "left",
                        backgroundColor: "#ECEF8000",
                        borderColor: "#303030",
                      }}
                    >
                      <strong>Weight:</strong> {exercise.weight} kg
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          ))
        ) : ownerId === savedWorkout.owner.id ? (
          <div className="mx-auto">
            <h2 className="mt-5 oswald-regular text-white">Add Exercises</h2>
          </div>
        ) : (
          <div className="mx-auto">
            <h2 className="mt-5 oswald-regular text-white">No exercises in this workout.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;
