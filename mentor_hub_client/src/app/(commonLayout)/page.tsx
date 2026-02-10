import HeroCarousel from "./hero/page";
import TutorPage from "./tutorCard/page";

const page = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroCarousel />
      <TutorPage />
    </main>
  );
};

export default page;
