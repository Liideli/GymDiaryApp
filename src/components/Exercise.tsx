import { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import AddExerciseModal from "./AddExerciseModal";
import { doGraphQLFetch } from "../graphql/fetch";
import { getExercisesByWorkout } from "../graphql/queries";
import WorkoutContext from "../WorkoutContext";
import { ExerciseType } from "../types/Exercise";
import ModifyExerciseModal from "./ModifyExerciseModal";

const Exercise = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>();
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const apiURL = import.meta.env.VITE_API_URL;
  const owner = localStorage.getItem("user")!;
  const ownerId = owner ? JSON.parse(owner).id : null;
  const contextWorkoutId = useContext(WorkoutContext);
  const savedWorkoutId = JSON.parse(window.localStorage.getItem("workoutId")!);

  const workoutId = contextWorkoutId.workoutId || savedWorkoutId;

  useEffect(() => {
    const fetchExercises = async () => {
      const data = await doGraphQLFetch(apiURL, getExercisesByWorkout, {
        workout: workoutId,
      });
      setExercises(data.exercisesByWorkout);
    };
    if (workoutId && ownerId) {
      fetchExercises();
    }
  }, [apiURL, ownerId, workoutId]);

  return (
    <div className="exercise">
      <div className="header">
        <AddExerciseModal show={showModal} onHide={() => setShowModal(false)} />
      </div>
      <div className="card-list">
        {ownerId ? (
          exercises.map((exercise) => (
            <Card
              key={exercise.id}
              style={{ flex: "1 1 50%", margin: "10px", maxWidth: "300px" }}
              onClick={() => {
                setSelectedExercise(exercise);
                setShowModal(true);
              }}
            >
              <Card.Body>
                <Card.Title>{exercise.name}</Card.Title>
                <Card.Text>
                  {exercise.description &&
                    `Description: ${exercise.description} \n`}
                  {exercise.duration !== 0 || null &&
                    `Duration: ${exercise.duration} seconds \n`}
                  {exercise.reps !== 0 || null && `Reps: ${exercise.reps} \n`}
                  {exercise.sets !== 0 || null && `Sets: ${exercise.sets} \n`}
                  {exercise.weight !== 0 || null && `Weight: ${exercise.weight} kg`}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className="mx-auto">
            <h2>Please login or register to mark down exercises.</h2>
          </div>
        )}
      </div>
      {selectedExercise && (
        <ModifyExerciseModal
          show={showModal}
          onHide={() => setShowModal(false)}
          exercise={selectedExercise}
        />
      )}
    </div>
  );
};

export default Exercise;
