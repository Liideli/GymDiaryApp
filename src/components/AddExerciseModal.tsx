import { useContext, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { createExercise } from '../graphql/queries';
import { doGraphQLFetch } from '../graphql/fetch';
import { ExerciseMessegeResponse } from '../types/ExerciseMessageResponse';
import WorkoutContext from '../WorkoutContext';
import React from 'react';

const AddExerciseModal: React.FC = () => {
  const [show, setShow] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [duration, setDuration] = useState('');
  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token')!;
  const contextWorkoutId = useContext(WorkoutContext);
  const savedWorkoutId = JSON.parse(window.localStorage.getItem("workoutId")!);

  const workoutId = contextWorkoutId.workoutId || savedWorkoutId;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddExercise = async () => {
    
    try {
      const exerciseData = await doGraphQLFetch(
        apiURL, 
        createExercise, 
        { 
          input: { 
            workout: workoutId, 
            name: exerciseName, 
            description: description, 
            weight: parseFloat(weight), 
            sets: parseInt(sets), 
            reps: parseInt(reps), 
            duration: parseInt(duration)
          }
        }, 
        token 
      ) as ExerciseMessegeResponse;
      console.log(exerciseData);
    } catch (error) {
      console.error(error);
    }
    // Close the modal after adding workout
    setShow(false);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Exercise
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formWorkoutName">
              <Form.Label>Exercise Name:</Form.Label>
              <Form.Control type="text" placeholder="Enter exercise name" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formWeight">
              <Form.Label>Weight:</Form.Label>
              <Form.Control type="text" placeholder='Enter weight' value={weight} onChange={(e) => setWeight(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formSets">
              <Form.Label>Sets:</Form.Label>
              <Form.Control type="text" placeholder='Enter sets' value={sets} onChange={(e) => setSets(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formReps">
              <Form.Label>Reps:</Form.Label>
              <Form.Control type="text" placeholder='Enter reps' value={reps} onChange={(e) => setReps(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formDuration">
              <Form.Label>Duration:</Form.Label>
              <Form.Control type="text" placeholder='Enter duration' value={duration} onChange={(e) => setDuration(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddExercise}>
            Add Workout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddExerciseModal;
