// src/components/About.jsx
import { Helmet } from "react-helmet-async";

const About = () => (
  <div className="m-3">
    <Helmet>
      <title>عن الموقع | أفلام TMDB</title>
      <meta
        name="description"
        content="تطبيق لاستعراض أفلام TMDB مع بحث وتفاصيل."
      />
    </Helmet>
    <h2>عن الموقع</h2>
    <p>
      هذا الموقع يعرض أحدث الأفلام من TMDB مع دعم البحث، التفاصيل، والاقتراحات.
    </p>
  </div>
);

export default About;
