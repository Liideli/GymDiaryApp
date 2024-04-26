import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { AddWorkoutModalProps } from '../types/Workout';
import { WorkoutMessegeResponse } from '../types/WorkoutMessegeResponse';
import { doGraphQLFetch } from '../graphql/fetch';
import { createWorkout } from '../graphql/queries';
import { FaPlus } from 'react-icons/fa';

const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({ onWorkoutAdded }) => {
  const [show, setShow] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token')!;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddWorkout = async () => {
    try {
      const workoutData = await doGraphQLFetch(apiURL, createWorkout, { input: { title: workoutName, description: description, date: date }}, token ) as WorkoutMessegeResponse;
      console.log(workoutData);
      onWorkoutAdded();
    } catch (error) {
      console.error(error);
    }
    // Close the modal after adding workout
    setShow(false);
  };

  return (
    <>
      <div className="add-button" onClick={handleShow}><FaPlus className="plus-icon" size="1.5em" /></div>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formWorkoutName">
              <Form.Label>Workout Name</Form.Label>
              <Form.Control type="text" placeholder="Enter workout name" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleAddWorkout}>
            Add Workout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddWorkoutModal;
