import { useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import AddExerciseModal from "./AddExerciseModal";

interface ExerciseProps {
  workoutId: string;
}

const Exercise: React.FC<ExerciseProps> = ({ workoutId }) => {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(0);
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams<{ workoutId: string }>();

    // Dummy data for the cards
    const [exercises, setExercises] = useState([
      { id: 1, title: "Rows", content: "Weight: 60kg Sets: 3, Reps: 10" },
      { id: 2, title: "Curls", content: "Weight: 20kg Sets: 4, Reps: 10" },
      { id: 3, title: "Facepulls", content: "Weight: 40kg Sets: 3, Reps: 10" },
    ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // call API to add exercise

    setName("");
    setWeight(0);
    setSets(0);
    setReps(0);
    setShowModal(false);
  };

  return (
    <div className="exercise">
      <div className="header">
        <AddExerciseModal show={showModal} onHide={() => setShowModal(false)} onAdd={handleSubmit} />
      </div>
      <div className="card-list">
        {exercises.map((exercise) => (
          <Card key={exercise.id} style={{ width: "20%", margin: "10px" }}>
            <Card.Body>
              <Card.Title>{exercise.title}</Card.Title>
              <Card.Text>{exercise.content}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Exercise;