// src/components/SkeletonCard.jsx
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Placeholder from "react-bootstrap/Placeholder";

const SkeletonCard = () => (
  <Col xs={12} sm={6} md={4} lg={3} xl={2}>
    <Card className="h-100">
      <div style={{ aspectRatio: "2/3", background: "rgba(0,0,0,0.08)" }} />
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={12} /> <Placeholder xs={10} /> <Placeholder xs={6} />
        </Placeholder>
      </Card.Body>
    </Card>
  </Col>
);

export default SkeletonCard;
