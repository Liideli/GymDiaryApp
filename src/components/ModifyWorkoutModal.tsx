import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { WorkoutUpdateInput } from "../types/Workout";
import { doGraphQLFetch } from "../graphql/fetch";
import { WorkoutMessegeResponse } from "../types/WorkoutMessegeResponse";
import { deleteWorkout, modifyWorkout } from "../graphql/queries";
import { FaTrash } from "react-icons/fa";

const ModifyWorkoutModal = ({
  show,
  onHide,
  workout,
  onWorkoutModified,
  onWorkoutDeleted,
}: {
  show: boolean;
  onHide: () => void;
  workout: WorkoutUpdateInput;
  onWorkoutModified: () => void;
  onWorkoutDeleted: () => void;
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState(workout);
  const [workoutName, setWorkoutName] = useState(selectedWorkout.title || "");
  const [description, setDescription] = useState(
    selectedWorkout.description || ""
  );
  const [date, setDate] = useState(selectedWorkout.date || "");

  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token")!;

  useEffect(() => {
    setSelectedWorkout(workout);
    setWorkoutName(workout.title || "");
    setDescription(workout.description || "");
    setDate(workout.date || "");
  }, [workout]);

  const handleClose = () => onHide();

  const handleModifyWorkout = async () => {
    try {
      (await doGraphQLFetch(
        apiURL,
        modifyWorkout,
        {
        modifyWorkoutId: selectedWorkout.id,
         input: { title: workoutName, description: description, date: date } },
        token
      )) as WorkoutMessegeResponse;
      onWorkoutModified();
    } catch (error) {
      console.error("Error:", error);
    }
    handleClose();
  };

  const handleDeleteWorkout = async () => {
    try {
      (await doGraphQLFetch(
        apiURL,
        deleteWorkout,
        {
          deleteWorkoutId: selectedWorkout.id,
        },
        token
      )) as WorkoutMessegeResponse;
      onWorkoutDeleted();
    } catch (error) {
      console.error("Error:", error);
    }
    handleClose();
  };

  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formWorkoutName">
            <Form.Label>Workout Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter workout name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={new Date(date).toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="danger" onClick={handleDeleteWorkout}>
          <FaTrash /> Delete
        </Button>
        <Button className="button-blue" onClick={handleModifyWorkout}>
          Modify Workout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModifyWorkoutModal;
