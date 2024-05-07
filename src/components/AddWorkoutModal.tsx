import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AddWorkoutModalProps } from "../types/Workout";
import { WorkoutMessageResponse } from "../types/WorkoutMessageResponse";
import { doGraphQLFetch } from "../graphql/fetch";
import { createWorkout } from "../graphql/queries";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({
  onWorkoutAdded,
}) => {
  const [show, setShow] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [validated, setValidated] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token")!;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddWorkout = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidated(true);
    if (!workoutName || !date) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      (await doGraphQLFetch(
        apiURL,
        createWorkout,
        { input: { title: workoutName, description: description, date: date } },
        token
      )) as WorkoutMessageResponse;
      toast.success("Workout added successfully!");
      onWorkoutAdded();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add workout!");
    }
    // Close the modal after adding workout
    setShow(false);
    setValidated(false);
  };

  return (
    <>
      <div className="add-button" onClick={handleShow}>
        <FaPlus className="plus-icon" size="1.5em" />
      </div>

      <Modal centered show={show} onHide={handleClose} style={{ zIndex: 10000 }}>
        <Modal.Header closeButton>
          <Modal.Title>Add Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleAddWorkout}>
            <Form.Group controlId="formWorkoutName">
              <Form.Label>Workout Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter workout name"
                value={workoutName}
                maxLength={20}
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
                rows={2}
                placeholder="Enter description (optional)"
                value={description}
                maxLength={100}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" type="submit" onClick={handleAddWorkout}>
            Add Workout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddWorkoutModal;
