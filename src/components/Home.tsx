import {Card } from "react-bootstrap";
import AddWorkoutModal from "./AddWorkoutModal";
import { useState } from "react";

const Home = () => {
  // Dummy data for the cards
  const cardData = [
    { id: 1, title: "Push", content: "Date: 31.3.2021" },
    { id: 2, title: "Pull", content: "Date: 31.3.2021" },
    { id: 3, title: "Legs", content: "Date: 31.3.2021" },
    { id: 4, title: "Push", content: "Date: 31.3.2021" },
    { id: 5, title: "Pull", content: "Date: 31.3.2021" },
    { id: 6, title: "Legs", content: "Date: 31.3.2021" },
    { id: 7, title: "Push", content: "Date: 31.3.2021" },
    { id: 8, title: "Pull", content: "Date: 31.3.2021" },
    { id: 9, title: "Legs", content: "Date: 31.3.2021" },
  ];

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="home">
      <div className="header">
      <AddWorkoutModal show={showModal} onHide={() => setShowModal(false)} />
      </div>
      <div className="card-list">
        {cardData.map((card) => (
          <Card key={card.id} style={{ width: "20%", margin: "10px" }}>
            <Card.Body>
              <Card.Title>{card.title}</Card.Title>
              <Card.Text>{card.content}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
