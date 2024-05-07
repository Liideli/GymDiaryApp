import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { Group } from '../types/Group';

type SettingsModalProps = {
  group: Group;
  show: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ group, show, onCancel, onDelete }) => {
  return (
    <Modal centered show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Group "{group.name}" settings</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="danger" onClick={onDelete}>
        <FaTrash /> Delete group
        </Button>
        <Button variant="secondary" onClick={onCancel}>
         Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;