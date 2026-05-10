import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const organizer = await (prisma as any).user.findFirst({
    where: { role: "ORGANIZER" }
  });

  if (!organizer) {
    console.log("No organizer found. Please create one first.");
    return;
  }

  // Clear existing events to avoid clutter
  console.log("Cleaning up existing events...");
  await (prisma as any).event.deleteMany({
     where: { organizerId: organizer.id }
  });

  const events = [
    {
      title: "Career Roadmap: Zero to MERN Hero",
      description: "A comprehensive mentorship session for Bangladeshi students aiming to master full-stack development. Learn how to navigate the local and global job market with industry experts.",
      date: new Date("2026-05-15T10:00:00Z"),
      location: "MentorHub HQ, Banani",
      capacity: 150,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "Portfolio Polish: Cracking Global Interviews",
      description: "Exclusive workshop on building a world-class portfolio. Get personalized feedback on your projects and resume from senior engineers working at Google and Meta.",
      date: new Date("2026-06-20T11:00:00Z"),
      location: "Pan Pacific Sonargaon, Dhaka",
      capacity: 80,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "UI/UX Deep Dive: Crafting Prime Interfaces",
      description: "Master the art of high-end design. This session focuses on modern aesthetics, glassmorphism, and user-centric flows for digital products in Bangladesh.",
      date: new Date("2026-07-10T09:30:00Z"),
      location: "Design Studio, Chittagong",
      capacity: 60,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "MentorHub Networking: Sylhet Student Meetup",
      description: "Connect with local mentors and fellow high-achievers. A casual networking event designed to build strong academic and professional bonds in the Sylhet region.",
      date: new Date("2026-08-05T10:30:00Z"),
      location: "Rose View, Sylhet",
      capacity: 120,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "Freelance Mastery: Strategy for Global Markets",
      description: "Empowering Bangladeshi talent on Upwork and Fiverr. Learn advanced bidding strategies, client communication, and how to scale your freelance business.",
      date: new Date("2026-09-12T10:00:00Z"),
      location: "IT Park, Rajshahi",
      capacity: 200,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "Mock Interview Marathon: Tech Edition",
      description: "Participate in real-world mock interviews with experienced hiring managers. Get instant feedback on your technical and soft skills to bridge the industry gap.",
      date: new Date("2026-10-22T09:00:00Z"),
      location: "Virtual Classroom Hub",
      capacity: 300,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "How to Ace STEM Exams: Expert Insights",
      description: "Specialized academic mentorship for science and engineering students. Proven techniques to master complex subjects and secure top grades in public exams.",
      date: new Date("2026-11-05T14:00:00Z"),
      location: "University Square, Khulna",
      capacity: 250,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "Cyber Security 101 for Tech Aspirants",
      description: "A secure-coding and threat-awareness workshop. Learn the basics of protecting your applications and data in the modern digital landscape of Bangladesh.",
      date: new Date("2026-12-15T11:00:00Z"),
      location: "Tech Lounge, Gulshan",
      capacity: 100,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "SaaS Blueprint: Building from Bangladesh",
      description: "In-depth case studies on successful SaaS startups born in Bangladesh. Learn about MVP development, product-market fit, and fundraising for local founders.",
      date: new Date("2027-01-20T08:00:00Z"),
      location: "Startup Dhaka Hub",
      capacity: 150,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "Digital Marketing for Modern Entrepreneurs",
      description: "Master social commerce and content strategy tailored for the Bangladeshi audience. Focus on scaling startups through targeted digital campaigns.",
      date: new Date("2027-02-14T10:00:00Z"),
      location: "RMG Plaza, Gazipur",
      capacity: 180,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "Open Source Contribution: Student Guide",
      description: "Demystifying GitHub and global collaboration. Start your open-source journey by contributing to high-impact projects under expert mentorship.",
      date: new Date("2027-03-05T11:00:00Z"),
      location: "DU Campus, Dhaka",
      capacity: 400,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "Ed-Tech Future: Classrooms in 2030",
      description: "Exploring the intersection of AI and education. A roundtable discussion with top mentors on how technology is redefining the teacher-student dynamic.",
      date: new Date("2027-04-18T10:30:00Z"),
      location: "Town Hall, Mymensingh",
      capacity: 200,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "Frontend Engineering: Advanced React Patterns",
      description: "Level up your UI skills with high-performance React patterns. Focus on state management, server components, and motion-heavy designs.",
      date: new Date("2027-05-30T09:00:00Z"),
      location: "Innovate Center, Barisal",
      capacity: 90,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "Backend Scalability: Moving Beyond Simple CRUD",
      description: "Architecting systems for millions of users. Deep dive into caching, message queues, and database optimization for growing platforms like MentorHub.",
      date: new Date("2027-06-15T10:00:00Z"),
      location: "Cloud Hub, Dhaka",
      capacity: 110,
      status: "UPCOMING",
      organizerId: organizer.id
    },
    {
      title: "MentorHub Community: Career Growth Summit",
      description: "The biggest gathering of mentors and mentees in the country. A full day of workshops, lightning talks, and job facilitation for the entire community.",
      date: new Date("2027-07-22T10:00:00Z"),
      location: "BICC Hall, Dhaka",
      capacity: 1000,
      status: "UPCOMING",
      organizerId: organizer.id
    }
  ];

  console.log(`Seeding ${events.length} MentorHub-themed events...`);
  
  for (const event of events) {
    await (prisma as any).event.create({ data: event });
  }

  console.log("Seeding complete! Everything is now project-aligned. ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
