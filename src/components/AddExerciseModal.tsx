import { useContext, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { createExercise } from "../graphql/queries";
import { doGraphQLFetch } from "../graphql/fetch";
import { ExerciseMessegeResponse } from "../types/ExerciseMessageResponse";
import WorkoutContext from "../WorkoutContext";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlusMinusInput from "./PlusMinusInput";

const AddExerciseModal = ({
  onExerciseAdded,
}: {
  show: boolean;
  onHide: () => void;
  onExerciseAdded: () => void;
}) => {
  const [show, setShow] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState(0);
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [duration, setDuration] = useState(0);
  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token")!;
  const contextWorkoutId = useContext(WorkoutContext);
  const savedWorkoutId = JSON.parse(window.localStorage.getItem("workoutId")!);

  const workoutId = contextWorkoutId.workoutId || savedWorkoutId;
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddExercise = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidated(true);
    if (!exerciseName) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const exerciseData = (await doGraphQLFetch(
        apiURL,
        createExercise,
        {
          input: {
            workout: workoutId,
            name: exerciseName,
            description: description,
            weight: parseFloat(Number(weight).toFixed(1)),
            sets: parseInt(String(sets)),
            reps: parseInt(String(reps)),
            duration: duration ? parseInt(String(duration)) : 0,
          },
        },
        token
      )) as ExerciseMessegeResponse;
      onExerciseAdded();
      console.log(exerciseData);
    } catch (error) {
      console.error(error);
    }
    console.log("token", token);
    setShow(false);
    setValidated(false);
  };

  return (
    <>
      <div className="add-button" onClick={handleShow}>
        <FaPlus className="plus-icon" size="1.5em" />
      </div>

      <Modal
        centered
        show={show}
        onHide={handleClose}
        style={{ zIndex: 10000 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleAddExercise}>
            <Form.Group controlId="formWorkoutName">
              <Form.Label>Exercise Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter exercise name"
                value={exerciseName}
                maxLength={20}
                onChange={(e) => setExerciseName(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Enter description (optional)"
                value={description}
                maxLength={100}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formWeight">
              <Form.Label>Weight:</Form.Label>
              <PlusMinusInput
                value={weight.toString()}
                onChange={(value: string) => setWeight(parseFloat(value))}
              />
            </Form.Group>

            <Form.Group controlId="formSets">
              <Form.Label>Sets:</Form.Label>
              <PlusMinusInput
                value={sets.toString()}
                onChange={(value: string) => setSets(parseFloat(value))}
              />
            </Form.Group>

            <Form.Group controlId="formReps">
              <Form.Label>Reps:</Form.Label>
              <PlusMinusInput
                value={reps.toString()}
                onChange={(value: string) => setReps(parseFloat(value))}
              />
            </Form.Group>

            <Form.Group controlId="formDuration">
              <Form.Label>Duration (minutes):</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter duration (minutes)"
                value={duration}
                onChange={(e) => {
                  let inputValue = parseInt(e.target.value);
                  if (isNaN(inputValue) || inputValue < 0) {
                    inputValue = 0;
                  }
                  setDuration(inputValue);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddExercise}>
            Add Exercise
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddExerciseModal;
