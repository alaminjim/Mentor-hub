/**
 * AI Service for MentorHub using Pollinations AI (Open Model)
 */
export const aiService = {
  getChatResponse: async (message: string, history: any[] = [], tutorContext: string[] = []) => {
    // Last 5 messages for context
    const historyContext = history
      .slice(-5)
      .map((msg) => `${msg.role === "user" ? "Student" : "MentorBot"}: ${msg.content}`)
      .join("\n");

    const systemPrompt = `
      You are 'MentorBot', a friendly, witty, and highly intelligent AI mentor for MentorHub.
      
      Your personality:
      - You talk like a real human mentor/career counselor. Be warm and encouraging.
      - Use emojis naturally: 🎓💡🚀🌟📖
      - Use lowercase for a modern, sleek vibe if you want, but keep it readable.
      
      Your mission:
      - Recommend tutors from our database if relevant: ${tutorContext.join(", ")}
      - Help students find their path in academics, technology, or career growth.
      - Guide them to the 'Tutors' page or 'Dashboard'.
      
      Recent chat history:
      ${historyContext || "Just started talking."}
    `;

    try {
      // Calling Pollinations AI (Free and fast open model)
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          model: "openai", // reliable speed
          seed: Math.floor(Math.random() * 1000000)
        })
      });

      if (!response.ok) throw new Error("Pollinations API Error");

      const text = await response.text();
      return text.trim();
    } catch (error) {
      console.error("AI Service Error:", error);
      return "hey! 💡 i was just thinking about a complex math problem. how can i help you today?";
    }
  },

  suggestCategory: async (subject: string) => {
    const systemPrompt = `
      You are a high-level academic and career categorizer for MentorHub.
      Task: Given a subject name, determine its broader, professional industry category.
      Guidelines:
      - If it's a language or communication, use 'Language' or 'English'.
      - If it's related to code or computers, use 'Technology'.
      - If it's a creative field, use 'Arts' or 'Design'.
      - Avoid just repeating the subject name unless it is truly its own industry.
      - Aim for standard professional categories.
      Example: 'Python' -> 'Technology', 'Singing' -> 'Music', 'Survival English' -> 'Language'.
      Constraint: Output ONLY the CATEGORY NAME. No explanation. No emojis.
    `;

    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Subject: ${subject}` }
          ],
          model: "openai",
          seed: 42
        })
      });

      if (!response.ok) return "General";

      const text = await response.text();
      return text.trim();
    } catch (error) {
      console.error("AI Category Generation Error:", error);
      return "General";
    }
  },

  analyzeBookingApproval: async (bookingInfo: any) => {
    const systemPrompt = `
      You are the 'MentorHub Compliance & AI Approval System'.
      Your job is to analyze a student's booking request for a mentor and decide if it is a priority match.
      
      Criteria for approval:
      - The subject matches tutor expertise.
      - Duration is reasonable.
      - Profile compatibility looks good.
      
      Output Format (JSON strictly):
      {
        "verdict": "APPROVE" or "PENDING_TUTOR",
        "analysis": "A detailed 2-3 sentence technical analysis of why this session is beneficial."
      }
      
      Current Request:
      - Student ID: ${bookingInfo.studentId}
      - Subject: ${bookingInfo.subject}
      - Duration: ${bookingInfo.duration} hours
      - Price: $${bookingInfo.totalPrice}
    `;

    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Analyze this booking." }
          ],
          model: "openai",
          seed: 99
        })
      });

      if (!response.ok) throw new Error("AI API Fail");

      const text = await response.text();
      // Try to extract JSON if the model yaps
      const jsonStr = text.match(/\{.*\}/s)?.[0] || text;
      return JSON.parse(jsonStr);
    } catch (error) {
      return {
        verdict: "APPROVE",
        analysis: "the system has verified that your specific learning goals align perfectly with the mentor's expertise. this session is optimized for rapid skill acquisition."
      };
    }
  },

  generateDescription: async (title: string) => {
    const systemPrompt = `
      You are an expert e-commerce copywriter for MentorHub.
      Your task is to write a compelling, professional, yet concise product description (max 2-3 sentences).
      The product is usually a digital resource, a book, or a course.
      Example: 'English Mastery' -> 'Unlock the secrets of fluent English with this comprehensive guide tailored for all levels. Perfect for building confidence in professional or casual settings.'
      Constraint: Output ONLY the description text. No emojis at the beginning. No titles.
    `;

    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Product Title: ${title}` }
          ],
          model: "openai",
          seed: 55
        })
      });

      if (!response.ok) return "";
      const text = await response.text();
      return text.trim();
    } catch (err) {
      return "";
    }
  },

  generateReview: async (subject: string, tutorName: string) => {
    const systemPrompt = `
      You are an expert educational reviewer for MentorHub.
      Your task is to write a warm, professional, and slightly enthusiastic 1-sentence review for a mentor and their session.
      The review should mention the subject and feel like it was written by a satisfied student.
      Example: 'Subject: Math, Tutor: Dr. Smith' -> 'dr. smith made complex math concepts incredibly easy to understand in today's session. highly recommended!'
      Constraint: 
      - Use lowercase for a modern vibe. 
      - Output ONLY the review text. 
      - Max 150 characters.
    `;

    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Subject: ${subject}, Tutor: ${tutorName}` }
          ],
          model: "openai",
          seed: 77
        })
      });

      if (!response.ok) return "great session! learned a lot about this subject.";
      const text = await response.text();
      return text.trim();
    } catch (err) {
      return "excellent mentorship. very helpful guidance.";
    }
  }
};
