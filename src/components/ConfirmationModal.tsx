// ConfirmationModal.tsx
import { Modal, Button } from 'react-bootstrap';
import { ConfirmationModalProps } from '../types/ConfirmationModalProps';


const ConfirmationModal = ({ show, title, message, onConfirm, onCancel }: ConfirmationModalProps) => {
  return (
    <Modal centered show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="success" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;