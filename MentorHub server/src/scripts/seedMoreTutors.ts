import "dotenv/config";
import { prisma } from "../lib/prisma.ts";

async function seedMoreTutors() {
  console.log("🌱 Updating Elite Tutors with Phone & Availability...");

  try {
    const tutorBatch = [
      { name: "John Wick", email: "john@assassin.com", phone: "+8801711223344" },
      { name: "Aria Stark", email: "aria@winterfell.com", phone: "+8801822334455" },
      { name: "Satoshi Nakamoto", email: "satoshi@bitcoin.org", phone: "+8801933445566" },
      { name: "Lara Croft", email: "lara@tombbox.com", phone: "+8801644556677" },
      { name: "Tony Stark", email: "tony@stark.com", phone: "+8801555667788" },
      { name: "Sherlock Holmes", email: "sherlock@221b.com", phone: "+8801366778899" },
      { name: "Zayn Malik", email: "zayn@music.com", phone: "+8801777889900" },
      { name: "Gal Gadot", email: "gal@amazon.com", phone: "+8801888990011" },
      { name: "Sundar Pichai", email: "sundar@google.com", phone: "+8801999001122" },
      { name: "Klara Bell", email: "klara@market.com", phone: "+8801600112233" },
      { name: "Bruno Mars", email: "bruno@funk.com", phone: "+8801511223344" },
      { name: "Chris Evans", email: "chris@shield.com", phone: "+8801322334455" },
      { name: "Emma Watson", email: "emma@univ.com", phone: "+8801733445566" },
      { name: "Steve Jobs", email: "steve@apple.com", phone: "+8801844556677" },
      { name: "Bill Gates", email: "bill@ms.com", phone: "+8801955667788" }
    ];

    const standardAvailability = {
        "SAT": ["10am-12pm", "4pm-6pm"],
        "SUN": ["11am-1pm", "7pm-9pm"],
        "MON": ["9am-11am", "3pm-5pm"],
        "TUE": ["10am-12pm", "5pm-7pm"],
        "WED": ["2pm-4pm", "8pm-10pm"]
    };

    for (const t of tutorBatch) {
      const email = t.email;
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (user) {
        await prisma.tutorProfile.update({
          where: { userId: user.id },
          data: {
            phone: t.phone,
            availability: standardAvailability,
          }
        } as any);
      }
    }

    console.log("✅ 15 Elite Tutors updated with Phone & Availability!");
  } catch (err) {
    console.error("❌ Updating failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedMoreTutors();
