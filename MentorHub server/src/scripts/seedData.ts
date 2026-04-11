import "dotenv/config";
import { prisma } from "../lib/prisma";

async function seedData() {
  console.log("🌱 Starting data seeding...");

  try {
    // 1. Seed Pricing Tiers
    const tiers = [
      { name: "Essential", price: 29, description: "Perfect for students starting their academic journey.", features: ["Access to basic academic mentors", "5 counseling sessions per month", "Email support", "Standard learning resources", "Community forum access"], isPopular: false },
      { name: "Master", price: 59, description: "The complete package for career-focused professionals.", features: ["Priority access to top-rated tutors", "Unlimited counseling sessions", "24/7 Priority chat support", "Advanced career roadmaps", "Mock interview sessions", "Direct Mentor Slack access", "Live Bootcamp invitations"], isPopular: true },
      { name: "Professional", price: 99, description: "Extended support for complex research and thesis work.", features: ["Direct access to industry experts", "Personalized research guidance", "Enterprise grade tools", "Lifetime access to premium events", "Full thesis review support", "Job placement assistance", "Resume optimization service"], isPopular: false },
    ];

    for (const tier of tiers) {
      await prisma.pricingTier.upsert({ where: { name: tier.name }, update: tier, create: tier });
    }

    // 2. Ensure Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin) {
      admin = await prisma.user.create({
        data: { id: "admin-id-v100", name: "Admin", email: adminEmail, role: "ADMIN" }
      });
      await prisma.account.create({
        data: { id: "admin-acc-v100", userId: admin.id, providerId: "credential", accountId: adminEmail, password: "password123" }
      });
    }

    // 3. Seed 16 UNIQUE Blogs with Rock-Solid Education Images
    console.log("📝 Seeding 16 Education Blogs with verified assets...");
    await prisma.blog.deleteMany({}); 

    const blogList = [
      { title: "how to find the perfect mentor.", excerpt: "identifying the right tutor for your unique learning style.", category: "academics", authorId: admin.id, image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000" },
      { title: "the science of peer learning.", excerpt: "why expert guidance is the fastest path to mastery.", category: "technology", authorId: admin.id, image: "https://images.unsplash.com/photo-1523240715639-99a8086f7340?auto=format&fit=crop&q=80&w=1000" },
      { title: "mastering math with a tutor.", excerpt: "breaking down complex equations with personalized support.", category: "academics", authorId: admin.id, image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1000" },
      { title: "mentorship in career growth.", excerpt: "how a professional mentor can accelerate your journey.", category: "career", authorId: admin.id, image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000" },
      { title: "online learning trends 2026.", excerpt: "the shift towards personalized digital education ecosystems.", category: "technology", authorId: admin.id, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000" },
      { title: "preparing for your first session.", excerpt: "getting the most value from your initial mentor meeting.", category: "productivity", authorId: admin.id, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" },
      { title: "coding bootcamps vs. private tutors.", excerpt: "finding the most efficient way to learn software engineering.", category: "technology", authorId: admin.id, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000" },
      { title: "benefits of early-stage mentorship.", excerpt: "building a solid foundation for your long-term goals.", category: "academics", authorId: admin.id, image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000" },
      { title: "mastering languages with experts.", excerpt: "why conversational practice with tutors is unmatched.", category: "career", authorId: admin.id, image: "https://images.unsplash.com/photo-1513258496099-48168024adb0?auto=format&fit=crop&q=80&w=1000" },
      { title: "productivity for professional tutors.", excerpt: "managing student performance while scaling your impact.", category: "productivity", authorId: admin.id, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" },
      { title: "digital tools in modern tutoring.", excerpt: "leveraging AI and interactive whiteboards for results.", category: "technology", authorId: admin.id, image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000" },
      { title: "success stories: from learner to leader.", excerpt: "how mentorship transformed these ambitious individuals.", category: "career", authorId: admin.id, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000" },
      { title: "financial planning for education.", excerpt: "budgeting for top-tier tutoring and elite resources.", category: "career", authorId: admin.id, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000" },
      { title: "creative writing mastery tips.", excerpt: "how expert feedback improves your narrative skills.", category: "academics", authorId: admin.id, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000" },
      { title: "the ethics of professional tutoring.", excerpt: "maintaining academic integrity while mentoring students.", category: "academics", authorId: admin.id, image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000" },
      { title: "future trends: AI-assisted tutoring in 2026.", excerpt: "the next evolution of personalized student support systems.", category: "technology", authorId: admin.id, image: "https://images.unsplash.com/photo-1573164713988-8665ea963095?auto=format&fit=crop&q=80&w=1000" }
    ];

    for (const blog of blogList) {
      await prisma.blog.create({
        data: {
          ...blog,
          content: `${blog.title} full article content go here. This is a placeholder for ${blog.title}. mentorship is key.`
        }
      });
    }
    console.log("✅ 16 UNIQUE Tutoring Blogs seeded with high-quality images.");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
