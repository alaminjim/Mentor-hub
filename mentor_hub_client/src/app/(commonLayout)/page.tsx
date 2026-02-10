import HeroCarousel from "./hero/page";
import ReviewsPage from "./review/page";
import TutorPage from "./tutorCard/page";

const page = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroCarousel />
      <TutorPage />
      <ReviewsPage />
    </main>
  );
};

export default page;
