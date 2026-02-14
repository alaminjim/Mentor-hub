import HowItWorks from "@/components/features/page";
import HeroCarousel from "./hero/page";
import ReviewsPage from "./review/page";
import TutorPage from "./tutorCard/page";
export const dynamic = "force-dynamic";

const page = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroCarousel />
      <TutorPage />
      <ReviewsPage />
      <HowItWorks />
    </main>
  );
};

export default page;
