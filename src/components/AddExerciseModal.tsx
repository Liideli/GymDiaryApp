import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const AddExerciseModal: React.FC = () => {
  const [show, setShow] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddWorkout = () => {
    // Handle adding workout logic here
    console.log('Workout Name:', workoutName);
    console.log('Description:', description);
    console.log('Date:', date);

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
              <Form.Control type="text" placeholder="Enter workout name" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formWeight">
              <Form.Label>Weight:</Form.Label>
              <Form.Control type="text" placeholder='Enter weight' />
            </Form.Group>

            <Form.Group controlId="formSets">
              <Form.Label>Sets:</Form.Label>
              <Form.Control type="text" placeholder='Enter sets' />
            </Form.Group>

            <Form.Group controlId="formReps">
              <Form.Label>Reps:</Form.Label>
              <Form.Control type="text" placeholder='Enter reps' />
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

export default AddExerciseModal;
