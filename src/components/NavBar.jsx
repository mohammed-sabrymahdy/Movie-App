// src/components/NavBar.jsx
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ListGroup from "react-bootstrap/ListGroup";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, endpoints, IMG_BASE } from "../utils/api";

function NavBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  // Debounce suggestions
  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      try {
        const { url, params } = endpoints.suggest(query.trim());
        const res = await api.get(url, { params });
        setSuggestions(res.data.results.slice(0, 8));
        setOpen(true);
        setActiveIdx(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goSearch = (q) => {
    if (!q.trim()) return;
    setOpen(false);
    navigate(`/?q=${encodeURIComponent(q.trim())}&page=1`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    goSearch(query);
  };

  const onKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      const s = suggestions[activeIdx];
      navigate(`/movie/${s.id}`);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: "orange" }}>
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand
          as={Link}
          to="/"
          className="text-white d-flex align-items-center"
        >
          <img
            style={{ width: 44, height: 44 }}
            src="/images/logo.png"
            alt="الشعار"
          />
          <span className="ms-2 fw-bold">أفلام</span>
        </Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            الرئيسية
          </Nav.Link>
          <Nav.Link as={Link} to="/about">
            عن الموقع
          </Nav.Link>
        </Nav>

        {/* Search with suggestions */}
        <div
          className="search-wrap"
          ref={boxRef}
          style={{ position: "relative", maxWidth: 420, width: "100%" }}
        >
          <Form className="d-flex gap-2" onSubmit={onSubmit}>
            <Form.Control
              type="search"
              placeholder="ابحث عن فيلم..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              aria-autocomplete="list"
              aria-expanded={open}
            />
            <Button variant="dark" type="submit">
              بحث
            </Button>
          </Form>

          {open && suggestions.length > 0 && (
            <ListGroup className="position-absolute w-100 mt-1 shadow suggestion-list">
              {suggestions.map((s, idx) => (
                <ListGroup.Item
                  key={s.id}
                  action
                  active={idx === activeIdx}
                  onMouseDown={() => navigate(`/movie/${s.id}`)}
                  className="d-flex align-items-center gap-2"
                >
                  <img
                    src={
                      s.poster_path
                        ? `${IMG_BASE}w92${s.poster_path}`
                        : "/images/placeholder.png"
                    }
                    alt={s.title}
                    width="32"
                    height="48"
                    loading="lazy"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="text-truncate">{s.title}</span>
                  {s.release_date && (
                    <small className="ms-auto text-muted">
                      {s.release_date.slice(0, 4)}
                    </small>
                  )}
                </ListGroup.Item>
              ))}
              <ListGroup.Item action onMouseDown={() => goSearch(query)}>
                عرض كل النتائج لـ: <strong>{query}</strong>
              </ListGroup.Item>
            </ListGroup>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default NavBar;
