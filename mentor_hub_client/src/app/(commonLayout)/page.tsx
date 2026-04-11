import Hero from "./hero/page";
import ReviewsPage from "./review/page";
import TutorPage from "./tutors/page";
import Categories from "@/components/home/Categories";
import Stats from "@/components/home/Stats";
import Benefits from "@/components/home/Benefits";
import Promotions from "@/components/home/Promotions";
import BlogPreview from "@/components/home/BlogPreview";
import Newsletter from "@/components/home/Newsletter";
import FAQ from "@/components/home/FAQ";
import { ScrollReveal, RevealItem } from "@/components/animations/ScrollReveal";

export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <main className="min-h-screen flex flex-col relative z-20">
      {/* 1. Hero Section V3 */}
      <Hero />
      
      {/* 2. Categorization Bento Grid */}
      <div id="features" className="relative">
        <Categories />
      </div>
      
      {/* 3. Featured Mentors - Needs ScrollReveal wrapper for context */}
      <ScrollReveal>
        <div className="section-padding">
          <RevealItem>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-16 lowercase text-center">
              top-rated. <span className="text-gradient">mentors.</span>
            </h2>
          </RevealItem>
          <TutorPage isFeatured={true} />
        </div>
      </ScrollReveal>
      
      {/* 4. Statistics Bento Grid */}
      <Stats />
      
      {/* 5. Benefits Parallax Section */}
      <Benefits />
      
      {/* 6. High-Impact Promotions */}
      <div id="pricing" className="relative">
        <Promotions />
      </div>
      
      {/* 7. Testimonials Section */}
      <ScrollReveal>
        <div className="section-padding py-0">
          <RevealItem>
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-16 lowercase text-center">
               student. <span className="text-gradient">stories.</span>
             </h2>
          </RevealItem>
          <ReviewsPage />
        </div>
      </ScrollReveal>
      
      {/* 8. Modern Blog Preview */}
      <BlogPreview />
      
      <ScrollReveal>
        <div className="section-padding grid lg:grid-cols-2 gap-12">
          {/* 9. Premium Newsletter */}
          <RevealItem>
            <Newsletter />
          </RevealItem>
          
          {/* 10. Minimalist FAQ */}
          <div id="contact">
            <RevealItem>
               <h2 className="text-4xl font-black tracking-tighter mb-8 lowercase">Got questions?</h2>
            </RevealItem>
            <FAQ />
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
};

export default Page;
