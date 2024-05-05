import { useEffect, useState } from 'react';
import { Card, ListGroup, Spinner } from 'react-bootstrap';
import { getGroups } from '../graphql/queries';
import { doGraphQLFetch } from '../graphql/fetch';
import type { Groups } from '../types/Groups';
import CreateGroupModal from './CreateGroupModal';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const [groups, setGroups] = useState<Groups[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const owner = localStorage.getItem("user")!;
  const ownerId = owner ? JSON.parse(owner).id : null;

  const fetchGroups = async () => {
    setLoading(true);
    const data = await doGraphQLFetch(apiURL, getGroups, {
      owner: ownerId,
    });
    setGroups(data.groups);
    setLoading(false);
  };

  useEffect(() => { 
    if (ownerId) {
      fetchGroups();
    }
  }, []);

  const handleGroupCreated = () => {
    fetchGroups();
  };

  return (
    <div className='home'>
      <div className='header'>
      {ownerId && (
        <div className="add-workout-button">
          <CreateGroupModal 
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onGroupCreated={handleGroupCreated}/>
        </div>
        )}
      </div>
      <div className="card-list">
        {loading ? (
          <Spinner variant="white" animation="border" role="status" className="mt-5" />
        ) : ownerId ? (
          groups.length > 0 ? (
            groups.map((group) => (
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
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <ListGroup.Item>
                      <h4>{group.name}</h4>
                    </ListGroup.Item>
                    <div style={{width: "2em"}}>{" "}</div>
                  </div>
                  <ListGroup variant="flush">
                    {group.description && (
                      <ListGroup.Item>{group.description}</ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="mx-auto">
              <h2 className="mt-5 oswald-regular text-white">
                Add Groups
              </h2>
            </div>
          )
        ) : (
          <div className="mx-auto">
            <h2 className="mt-5 oswald-regular text-white">
              Please login or register to create groups.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;