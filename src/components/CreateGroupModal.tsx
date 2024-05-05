import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createGroup } from "../graphql/queries";
import { doGraphQLFetch } from "../graphql/fetch";
import { createGroupModalProps } from "../types/Groups";
import { GroupMessageResponse } from "../types/GroupMessageResponse";

const CreateGroupModal: React.FC<createGroupModalProps> = ({onGroupCreated}) => {
  const [show, setShow] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [validated, setValidated] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token")!;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCreateGroup = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidated(true);
    if (!groupName) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      (await doGraphQLFetch(
        apiURL,
        createGroup,
        { input: { name: groupName, description: description } },
        token
      )) as GroupMessageResponse;
      toast.success("Group created successfully!");
      onGroupCreated();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create group!");
    }
    // Close the modal after creating group
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
          <Modal.Title>Create Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleCreateGroup}>
            <Form.Group controlId="formGroupName">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group name"
                value={groupName}
                maxLength={15}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a group name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description (optional)"
                maxLength={100}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" type="submit" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateGroupModal;