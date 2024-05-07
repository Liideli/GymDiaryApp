import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Spinner } from "react-bootstrap";
import {
  deleteGroup,
  getGroup,
  joinGroup,
  leaveGroup,
} from "../graphql/queries";
import { doGraphQLFetch } from "../graphql/fetch";
import type { Group } from "../types/Group";
import { FaMedal } from "react-icons/fa";
import { User } from "../types/User";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import { FaGear } from "react-icons/fa6";
import SettingsModal from "./SettingsModal";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setSelectedUser] = useState<User>();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState("confirm");
  const [isMember, setIsMember] = useState(false);
  const currentUserId = JSON.parse(localStorage.getItem("user")!).id;

  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token")!;

  const fetchGroup = async () => {
    const data = await doGraphQLFetch(apiURL, getGroup, { groupId: id }, token);
    if (data.group) {
      setGroup(data.group);
      setLoading(false);
      checkMembership(data.group);
    }
  };

  const checkMembership = (group: Group) => {
    const userId = JSON.parse(localStorage.getItem("user")!).id;
    const isUserMember = group.members.some((member) => member.id === userId);
    setIsMember(isUserMember);
  };

  const handleGroupAction = () => {
    setModalAction(isMember ? "cancel" : "confirm");
    setShowModal(true);
  };

  const confirmJoinGroup = async () => {
    try {
      await doGraphQLFetch(apiURL, joinGroup, { joinGroupId: id }, token);
      toast.success("You have joined the group!");
      fetchGroup();
    } catch (err) {
      toast.error("You are already a member of this group!");
      console.log(err);
    }
    setShowModal(false);
  };

  const confirmLeaveGroup = async () => {
    try {
      await doGraphQLFetch(apiURL, leaveGroup, { leaveGroupId: id }, token);
      toast.success("You have left the group!");
      fetchGroup();
    } catch (err) {
      toast.error("You are not a member of this group!");
      console.log(err);
    }
    setShowModal(false);
  };

  // Function to handle clicking the gear icon
  const handleDeleteGroup = () => {
    setShowDeleteModal(true);
  };

  // Function to handle clicking the delete button in the DeleteModal
  const confirmDeleteGroup = () => {
    setShowDeleteModal(false);
    setShowConfirmModal(true);
  };
  const handleFinalDelete = async () => {
    try {
      await doGraphQLFetch(apiURL, deleteGroup, { deleteGroupId: id }, token);
      toast.success(`You have deleted group ${group?.name} ❌`);
      navigate("/groups");
    } catch (err) {
      toast.error("You are not a member of this group!");
      console.log(err);
    }
    setShowModal(false);
  };

  useEffect(() => {
    if (token) {
      fetchGroup();
    } else {
      navigate("/login");
    }
  }, []);

  if (loading) {
    return (
      <Spinner
        variant="white"
        animation="border"
        role="status"
        className="mt-5"
      />
    );
  }

  return (
    <div>
      <div className="center-content">
        <div className="group-header">
          {group && group.owner.id === currentUserId && (
            <div className="header-settings">
              <Button size="sm" variant="secondary" onClick={handleDeleteGroup}>
                <FaGear />
              </Button>
              <div style={{ width: "2em" }}> </div>
            </div>
          )}
          {group && <h2>{group.name}</h2>}
          <p>{group && group.description}</p>
          <p>By: {group && group.owner.user_name}</p>
          <Button variant="dark" onClick={handleGroupAction}>
            {isMember ? "Leave Group" : "Join Group"}
          </Button>{" "}
        </div>
        <ConfirmationModal
          show={showModal}
          title={
            modalAction === "confirm"
              ? `Join ${group?.name}`
              : `Leave ${group?.name}`
          }
          message={
            modalAction === "confirm"
              ? `Are you sure you want to join ${group?.name}? Your workouts will be seen by the group members.`
              : `Are you sure you want to leave ${group?.name}?`
          }
          onConfirm={
            modalAction === "confirm" ? confirmJoinGroup : confirmLeaveGroup
          }
          onCancel={() => setShowModal(false)}
        />
        {group && (
          <SettingsModal
            group={group}
            show={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            onDelete={confirmDeleteGroup}
          />
        )}

        {group && (
          <ConfirmationModal
            show={showConfirmModal}
            title={`Delete group "${group.name}"?`}
            message="Are you sure you want to delete this group? This action cannot be undone."
            onConfirm={handleFinalDelete}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}
      </div>
      <h3 className="text-white">Members</h3>
      <div className="card-list">
        {group && group.members.length > 0 ? (
          group.members
            .sort((a, b) => b.workoutCount - a.workoutCount)
            .map((member, index) => (
              <Card
                className={`custom-card card ${
                  index === 0
                    ? "gold"
                    : index === 1
                    ? "silver"
                    : index === 2
                    ? "bronze"
                    : ""
                }`}
                key={member.id}
                style={{ flex: "1 1 50%", margin: "10px" }}
                onClick={() => {
                  if (isMember) {
                    setSelectedUser(member);
                    localStorage.setItem(
                      "selectedMember",
                      JSON.stringify(member)
                    );
                    navigate(`/memberworkouts/${member.user_name}`);
                  } else {
                    toast.error("You need to join the group first!");
                  }
                }}
              >
                <Card.Body>
                  <Card.Title>
                    {index === 0 && <FaMedal />}
                    {member.user_name}
                  </Card.Title>
                  <Card.Text>{member.workoutCount} workouts</Card.Text>
                </Card.Body>
              </Card>
            ))
        ) : (
          <p>No members</p>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
