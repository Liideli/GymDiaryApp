import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, ListGroup } from "react-bootstrap";
import { getGroup } from "../graphql/queries";
import { doGraphQLFetch } from "../graphql/fetch";
import type { Group } from "../types/Group";
import { FaUser } from "react-icons/fa";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL;

  const fetchGroup = async () => {
    setLoading(true);
    const data = await doGraphQLFetch(apiURL, getGroup, { groupId: id });
    setGroup(data.group);
    setLoading(false);
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  return (
    <div>
      <div className="center-content">
      <div className="group-header">
        {group && <h2>Group: {group.name}</h2>}
        <p>{group && group.description}</p>
        <h3>Owner</h3>
        <p>{group && group.owner.user_name}</p>
      </div>
      </div>
      <h3 className="text-white">Members</h3>
      <div className="card-list">
        {group && group.members.length > 0 ? (
          <Card style={{ flex: "1 1 50%", margin: "10px", maxWidth: "16em" }}>
            <ListGroup variant="flush">
              {group.members.map((member) => (
                <ListGroup.Item key={member.id}>
                  <div className="user-info">
                    <FaUser />
                    <h2>{member.user_name}</h2>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        ) : (
          <p>No members</p>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
