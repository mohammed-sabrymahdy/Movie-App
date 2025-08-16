// src/components/MovieDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { api, endpoints, IMG_BASE } from "../utils/api";
import { Helmet } from "react-helmet-async";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { url } = endpoints.details(id);
      const res = await api.get(url);
      if (!cancelled) setMovie(res.data);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!movie) return <p className="text-center my-5">جار التحميل…</p>;

  const poster = movie.poster_path
    ? `${IMG_BASE}w500${movie.poster_path}`
    : "/images/placeholder.png";

  return (
    <>
      <Helmet>
        <title>{movie.title} | تفاصيل الفيلم</title>
        <meta
          name="description"
          content={movie.overview?.slice(0, 150) || "تفاصيل الفيلم"}
        />
      </Helmet>

      <Card className="m-1">
        <Card.Img variant="top" src={poster} alt={movie.title} loading="lazy" />
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Card.Text>{movie.overview || "لا يوجد وصف"}</Card.Text>
          <p className="mb-1">التقييم: {movie.vote_average?.toFixed(1)}</p>
          <p className="mb-0">تاريخ الإصدار: {movie.release_date}</p>
        </Card.Body>
      </Card>
    </>
  );
};

export default MovieDetails;
