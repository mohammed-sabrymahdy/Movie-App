// src/components/CardMovie.jsx
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { IMG_BASE } from "../utils/api";

const CardMovie = ({ id, title, description, posterPath, vote, date }) => {
  const posterW185 = posterPath
    ? `${IMG_BASE}w185${posterPath}`
    : "/images/placeholder.png";
  const posterW342 = posterPath
    ? `${IMG_BASE}w342${posterPath}`
    : "/images/placeholder.png";
  const posterW500 = posterPath
    ? `${IMG_BASE}w500${posterPath}`
    : "/images/placeholder.png";

  return (
    <Col xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card className="h-100 movie-card">
        <Link to={`/movie/${id}`} className="text-decoration-none">
          <Card.Img
            variant="top"
            src={posterW342}
            srcSet={`${posterW185} 185w, ${posterW342} 342w, ${posterW500} 500w`}
            sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 20vw"
            alt={title}
            loading="lazy"
          />
        </Link>
        <Card.Body className="d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <Card.Title className="fs-6 mb-0 text-truncate" title={title}>
              {title}
            </Card.Title>
            {typeof vote === "number" && (
              <span className="badge bg-success">{vote.toFixed(1)}</span>
            )}
          </div>
          <Card.Text className="text-muted small flex-grow-1">
            {description
              ? description.length > 120
                ? description.slice(0, 120) + "…"
                : description
              : "لا يوجد وصف"}
          </Card.Text>
          {date && <small className="text-muted">تاريخ الإصدار: {date}</small>}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CardMovie;
