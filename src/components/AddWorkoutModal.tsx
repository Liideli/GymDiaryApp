import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const AddWorkoutModal = () => {
  const [show, setShow] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [date, setDate] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddWorkout = () => {
    // Handle adding workout logic here
    console.log('Workout Name:', workoutName);
    console.log('Date:', date);

    // Close the modal after adding workout
    setShow(false);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Workout
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formWorkoutName">
              <Form.Label>Workout Name</Form.Label>
              <Form.Control type="text" placeholder="Enter workout name" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} />
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
          <Button variant="primary" onClick={handleAddWorkout}>
            Add Workout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddWorkoutModal;
