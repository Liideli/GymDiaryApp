import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { deleteExercise, modifyExercise } from "../graphql/queries";
import { doGraphQLFetch } from "../graphql/fetch";
import { ExerciseUpdateInput } from "../types/Exercise";
import { FaTrash } from "react-icons/fa";

const ModifyExerciseModal = ({
  show,
  onHide,
  exercise,
  onExerciseModified,
  onExerciseDeleted,
}: {
  show: boolean;
  onHide: () => void;
  exercise: ExerciseUpdateInput;
  onExerciseModified: () => void;
  onExerciseDeleted: () => void;
}) => {
  const [selectedExercise] = useState(exercise);
  const [name, setName] = useState(selectedExercise.name || "");
  const [description, setDescription] = useState(
    selectedExercise.description || ""
  );
  const [sets, setSets] = useState(selectedExercise.sets || 0);
  const [reps, setReps] = useState(selectedExercise.reps || 0);
  const [weight, setWeight] = useState(selectedExercise.weight || 0);
  const [duration, setDuration] = useState(selectedExercise.duration || 0);

  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token")!;

  const handleClose = () => onHide();

  const handleModifyExercise = async () => {
    try {
      await doGraphQLFetch(
        apiURL,
        modifyExercise,
        {
          modifyExerciseId: selectedExercise.id,
          input: {
            name: name,
            description: description,
            weight: parseFloat(Number(weight).toFixed(1)),
            sets: parseInt(String(sets)),
            reps: parseInt(String(reps)),
            duration: parseInt(String(duration)),
          },
        },
        token
      );
      onExerciseModified();
    } catch (error) {
      console.error("Error:", error);
    }
    handleClose();
  };

  const handleDeleteExercise = async () => {
    try {
      await doGraphQLFetch(
        apiURL,
        deleteExercise,
        {
          deleteExerciseId: selectedExercise.id,
        },
        token
      );
      onExerciseDeleted();
    } catch (error) {
      console.error("Error:", error);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Exercise</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleModifyExercise}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sets</Form.Label>
            <Form.Control
              type="number"
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Reps</Form.Label>
            <Form.Control
              type="number"
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDeleteExercise}>
          <FaTrash /> Delete
        </Button>
        <Button className="button-blue" onClick={handleModifyExercise}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModifyExerciseModal;
