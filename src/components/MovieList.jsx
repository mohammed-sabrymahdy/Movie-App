// src/components/MovieList.jsx
import { useEffect, useMemo, useState } from "react";
import Row from "react-bootstrap/Row";
import Pagination from "react-bootstrap/Pagination";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api, endpoints } from "../utils/api";
import CardMovie from "./CardMovie";
import SkeletonCard from "./SkeletonCard";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const MovieList = () => {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const query = sp.get("q")?.trim() || "";
  const page = clamp(parseInt(sp.get("page") || "1", 10), 1, 1000);

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // اجلب الداتا
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const { url, params } = query
          ? endpoints.search({ query, page })
          : endpoints.popular({ page });

        const res = await api.get(url, { params });
        if (!cancelled) {
          setMovies(res.data.results || []);
          setTotalPages(res.data.total_pages || 1);
        }
      } catch {
        if (!cancelled) {
          setMovies([]);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [query, page]);

  // Pagination numbers with ellipsis
  const pages = useMemo(() => {
    const max = Math.min(totalPages, 500); // TMDB أقصى 500
    const window = 5;
    const items = new Set([
      1,
      max,
      page,
      page - 1,
      page + 1,
      page - 2,
      page + 2,
    ]);
    const cleaned = [...items]
      .filter((p) => p >= 1 && p <= max)
      .sort((a, b) => a - b);

    const withEllipsis = [];
    for (let i = 0; i < cleaned.length; i++) {
      withEllipsis.push(cleaned[i]);
      if (i < cleaned.length - 1 && cleaned[i + 1] - cleaned[i] > 1) {
        withEllipsis.push("…");
      }
    }
    return withEllipsis;
  }, [page, totalPages]);

  const gotoPage = (p) => {
    const next = clamp(p, 1, Math.min(totalPages, 500));
    const params = new URLSearchParams(sp);
    params.set("page", String(next));
    if (query) params.set("q", query);
    else params.delete("q");
    navigate({ pathname: "/", search: params.toString() });
  };

  return (
    <>
      {loading ? (
        <Row className="g-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Row>
      ) : movies.length ? (
        <>
          <Row className="g-4">
            {movies.map((m) => (
              <CardMovie
                key={m.id}
                id={m.id}
                title={m.title}
                description={m.overview}
                posterPath={m.poster_path}
                vote={m.vote_average}
                date={m.release_date}
              />
            ))}
          </Row>

          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First
                disabled={page === 1}
                onClick={() => gotoPage(1)}
              />
              <Pagination.Prev
                disabled={page === 1}
                onClick={() => gotoPage(page - 1)}
              />
              {pages.map((p, idx) =>
                p === "…" ? (
                  <Pagination.Ellipsis key={`e${idx}`} disabled />
                ) : (
                  <Pagination.Item
                    key={p}
                    active={p === page}
                    onClick={() => gotoPage(p)}
                  >
                    {p}
                  </Pagination.Item>
                )
              )}
              <Pagination.Next
                disabled={page === totalPages}
                onClick={() => gotoPage(page + 1)}
              />
              <Pagination.Last
                disabled={page === totalPages}
                onClick={() => gotoPage(totalPages)}
              />
            </Pagination>
          </div>
        </>
      ) : (
        <p className="text-center my-5">
          لا يوجد نتائج لبحث: <strong>{query}</strong>
        </p>
      )}
    </>
  );
};

export default MovieList;
