import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { getGroup, joinGroup, leaveGroup } from "../graphql/queries";
import { doGraphQLFetch } from "../graphql/fetch";
import type { Group } from "../types/Group";
import { FaMedal } from "react-icons/fa";
import { User } from "../types/User";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [, setLoading] = useState(false);
  const [, setSelectedUser] = useState<User>();
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("join");
  const [isMember, setIsMember] = useState(false);

  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token")!;

  const fetchGroup = async () => {
    setLoading(true);
    const data = await doGraphQLFetch(apiURL, getGroup, { groupId: id });
    setGroup(data.group);
    setLoading(false);
    checkMembership(data.group);
  };

  const checkMembership = (group: Group) => {
    const userId = JSON.parse(localStorage.getItem("user")!).id;
    const isUserMember = group.members.some(member => member.id === userId);
    setIsMember(isUserMember);
  };

  const handleGroupAction = () => {
    setModalAction(isMember ? 'leave' : 'join');
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

  useEffect(() => {
    fetchGroup();
  }, []);

  return (
    <div>
      <div className="center-content">
        <div className="group-header">
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
            modalAction === "join"
              ? `Join ${group?.name}`
              : `Leave ${group?.name}`
          }
          message={
            modalAction === "join"
              ? `Are you sure you want to join ${group?.name}? Your workouts will be seen by the group members.`
              : `Are you sure you want to leave ${group?.name}?`
          }
          onConfirm={
            modalAction === "join" ? confirmJoinGroup : confirmLeaveGroup
          }
          onCancel={() => setShowModal(false)}
        />
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
