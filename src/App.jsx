// src/App.jsx
import Container from "react-bootstrap/Container";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import About from "./components/About";
import { Helmet } from "react-helmet-async";

const App = () => {
  return (
    <div>
      <Helmet>
        <html lang="ar" />
        <title>أفلام TMDB | بحث ومراجعات</title>
        <meta
          name="description"
          content="ابحث عن أحدث الأفلام بالعربية واعرض التفاصيل والتقييمات."
        />
      </Helmet>

      <NavBar />

      <Container className="py-4">
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/about" element={<About />} />
          <Route
            path="*"
            element={<h2 className="text-center">الصفحة غير موجودة</h2>}
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
