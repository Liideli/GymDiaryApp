import { useEffect, useState } from "react";
import { Card, ListGroup, Spinner } from "react-bootstrap";
import { getGroups } from "../graphql/queries";
import { doGraphQLFetch } from "../graphql/fetch";
import type { Groups } from "../types/Groups";
import CreateGroupModal from "./CreateGroupModal";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const [groups, setGroups] = useState<Groups[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [, setSelectedGroupId] = useState<string>();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token")!;
  const owner = localStorage.getItem("user")!;
  const ownerId = owner ? JSON.parse(owner).id : null;

  const fetchGroups = async () => {
    const data = await doGraphQLFetch(
      apiURL,
      getGroups,
      {
        owner: ownerId,
      },
      token
    );
    setGroups(data.groups);
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchGroups();
    } else {
      navigate("/login");
    }
  }, []);

  const handleGroupCreated = () => {
    fetchGroups();
  };

  return (
    <div className="home">
      <div className="header">
        {ownerId && (
          <div className="add-workout-button">
            <CreateGroupModal
              show={showAddModal}
              onHide={() => setShowAddModal(false)}
              onGroupCreated={handleGroupCreated}
            />
          </div>
        )}
      </div>
      <div className="card-list">
        {loading ? (
          <Spinner
            variant="white"
            animation="border"
            role="status"
            className="mt-5"
          />
        ) : ownerId && (
          groups.length > 0 ? (
            groups
              .sort(
                (a, b) => (b.members?.length ?? 0) - (a.members?.length ?? 0)
              )
              .map((group) => (
                <Card
                  className="custom-card card"
                  key={group.id}
                  style={{ flex: "1 1 50%", margin: "10px" }}
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    navigate(`/group/${group.id}`);
                  }}
                >
                  <Card.Body>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                      }}
                    ></div>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <div className="group-name-container">
                          <h4>{group.name}</h4>
                        </div>
                      </ListGroup.Item>
                      {group.description && (
                        <ListGroup.Item>{group.description}</ListGroup.Item>
                      )}
                      <ListGroup.Item>
                        {group.members && group.members.length} members
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              ))
          ) : (
            <div className="mx-auto">
              <h2 className="mt-5 oswald-regular text-white">Add Groups</h2>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Groups;
