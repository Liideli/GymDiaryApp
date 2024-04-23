import { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import AddExerciseModal from "./AddExerciseModal";
import { doGraphQLFetch } from "../graphql/fetch";
import { getExercisesByWorkout } from "../graphql/queries";
import WorkoutContext from "../WorkoutContext";
import { ExerciseType } from "../types/Exercise";

const Exercise = () => {
  const [showModal, setShowModal] = useState(false);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const apiURL = import.meta.env.VITE_API_URL;
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
    fetchExercises();
  }, []);

  return (
    <div className="exercise">
      <div className="header">
        <AddExerciseModal show={showModal} onHide={() => setShowModal(false)} />
      </div>
      <div className="card-list">
        {exercises.map((exercise) => (
          <Card key={exercise.id} style={{ width: "20%", margin: "10px" }}>
            <Card.Body>
              <Card.Title>{exercise.name}</Card.Title>
              <Card.Text>
                {exercise.description &&
                  `Description: ${exercise.description} \n`}
                {exercise.duration &&
                  `Duration: ${exercise.duration} seconds \n`}
                {exercise.reps && `Reps: ${exercise.reps} \n`}
                {exercise.sets && `Sets: ${exercise.sets} \n`}
                {exercise.weight && `Weight: ${exercise.weight} kg`}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Exercise;
