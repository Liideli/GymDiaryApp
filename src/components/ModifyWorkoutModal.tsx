import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { WorkoutUpdateInput } from "../types/Workout";
import { doGraphQLFetch } from "../graphql/fetch";
import { WorkoutMessegeResponse } from "../types/WorkoutMessegeResponse";
import { deleteWorkout, modifyWorkout } from "../graphql/queries";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [date, setDate] = useState(new Date().toISOString().split("T")[0] || "");
  const [validated, setValidated] = useState(false);

  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token")!;

  useEffect(() => {
    setSelectedWorkout(workout);
    setWorkoutName(workout.title || "");
    setDescription(workout.description || "");
    setDate(workout.date ? new Date(workout.date).toISOString().split("T")[0] : "");
  }, [workout]);

  const handleClose = () => onHide();

  const handleModifyWorkout = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidated(true);
    if (!workoutName || !date) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      (await doGraphQLFetch(
        apiURL,
        modifyWorkout,
        {
          modifyWorkoutId: selectedWorkout.id,
          input: { title: workoutName, description: description, date: date },
        },
        token
      )) as WorkoutMessegeResponse;
      onWorkoutModified();
      toast.success("Workout modified successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to modify workout!");
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
      toast.success("Workout deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete workout!");
    }
    handleClose();
  };

  return (
    <>
    <Modal centered show={show} onHide={onHide} style={{ zIndex: 10000 }}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated}>
          <Form.Group controlId="formWorkoutName">
            <Form.Label>Workout Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter workout name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a workout name.
            </Form.Control.Feedback>
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
              value={date ? new Date(date).toISOString().slice(0, 10) : ""}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a date.
            </Form.Control.Feedback>
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
    </>
  );
};

export default ModifyWorkoutModal;
