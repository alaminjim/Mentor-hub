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
        data: { id: "admin-id-final-v2", name: "Admin", email: adminEmail, role: "ADMIN" }
      });
      await prisma.account.create({
        data: { id: "admin-acc-final-v2", userId: admin.id, providerId: "credential", accountId: adminEmail, password: "password123" }
      });
    }

    // 3. Seed 16 UNIQUE Blogs focused on TUTORING and EDUCATION
    console.log("📝 Seeding 16 UNIQUE Tutoring-related Blogs...");
    await prisma.blog.deleteMany({}); 

    const blogList = [
      { title: "how to find the perfect mentor.", excerpt: "a guide to identifying the right tutor for your learning style.", category: "academics", authorId: admin.id, image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "the science of peer-to-peer learning.", excerpt: "why learning from experts is the fastest way to master any skill.", category: "technology", authorId: admin.id, image: "https://images.unsplash.com/photo-1523240715639-99a8086f7340?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "effective tutoring methods for math.", excerpt: "breaking down complex equations with personalized guidance.", category: "academics", authorId: admin.id, image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "the role of mentorship in career growth.", excerpt: "how a tutor can help you navigate the corporate world.", category: "career", authorId: admin.id, image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "online vs. in-person tutoring: what's better?", excerpt: "exploring the pros and cons of modern learning environments.", category: "technology", authorId: admin.id, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "preparing for your first mentoring session.", excerpt: "tips for students to get the most value out of their tutors.", category: "productivity", authorId: admin.id, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "coding bootcamps vs. private tutors.", excerpt: "finding the right path for your software development journey.", category: "technology", authorId: admin.id, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "the benefits of early-stage mentorship.", excerpt: "building a strong foundation for lifelong academic success.", category: "academics", authorId: admin.id, image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "mastering languages with native tutors.", excerpt: "why conversational practice is key to fluency.", category: "career", authorId: admin.id, image: "https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "productivity hacks for professional tutors.", excerpt: "how to manage multiple students and maintain quality.", category: "productivity", authorId: admin.id, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "the impact of digital tools on tutoring.", excerpt: "using whiteboards and AI to enhance the learning process.", category: "technology", authorId: admin.id, image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "success stories: from student to mentor.", excerpt: "real-world examples of how tutoring changed lives.", category: "career", authorId: admin.id, image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "financial planning for private education.", excerpt: "budgeting for tutors and educational resources.", category: "career", authorId: admin.id, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "creative writing: finding an expert voice.", excerpt: "how literature tutors help you build compelling narratives.", category: "academics", authorId: admin.id, image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "the ethics of professional tutoring.", excerpt: "ensuring academic integrity while providing guidance.", category: "academics", authorId: admin.id, image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop", content: "..." },
      { title: "future trends: AI-assisted tutoring in 2026.", excerpt: "the next evolution of personalized student support.", category: "technology", authorId: admin.id, image: "https://images.unsplash.com/photo-1573164713988-8665ea963095?q=80&w=1000&auto=format&fit=crop", content: "..." }
    ];

    for (const blog of blogList) {
      await prisma.blog.create({ data: blog });
    }
    console.log("✅ 16 Tutoring-related Blogs seeded with UNIQUE assets.");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
