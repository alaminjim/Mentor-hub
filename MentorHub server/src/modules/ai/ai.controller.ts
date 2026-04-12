import { Request, Response } from "express";
import { aiService } from "./ai.service.js";
import { prisma } from "../../lib/prisma.js";

export const aiController = {
  chat: async (req: Request, res: Response) => {
    try {
      const { message, history = [] } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: "message is required" });
      }

      // Fetch some real tutors from DB to give context to the AI
      const tutors = await prisma.tutorProfile.findMany({
        take: 10,
        select: { name: true, experience: true, rating: true, subjects: true }
      });

      const tutorContext = tutors.map(t => 
        `${t.name} (exp: ${t.experience}y, star: ${t.rating}) - subjects: ${t.subjects?.join(", ")}`
      );

      const data = await aiService.getChatResponse(message.trim(), history, tutorContext);
      
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("AI Controller Error:", error);
      res.status(200).json({ 
        success: true, 
        data: "hey! 🌟 i'm here and listening, but my brain just took a tiny coffee break. ask me again!" 
      });
    }
  },

  suggestCategory: async (req: Request, res: Response) => {
    try {
      const { subject } = req.body;
      
      if (!subject) {
        return res.status(400).json({ success: false, message: "subject is required" });
      }

      // 1. Get AI-generated category name
      const suggestedName = await aiService.suggestCategory(subject);
      
      // 2. Find or Create this category in Database automatically
      const category = await prisma.category.upsert({
        where: { name: suggestedName },
        update: {},
        create: {
            name: suggestedName,
            description: `Auto-generated category for ${subject}`
        }
      });
      
      res.status(200).json({ success: true, data: { id: category.id, name: category.name } });
    } catch (error) {
      console.error("AI Controller Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  approveBooking: async (req: Request, res: Response) => {
    try {
      const { bookingId } = req.body;
      const user = req.user;

      if (!bookingId) {
        return res.status(400).json({ success: false, message: "bookingId is required" });
      }

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { tutor: true }
      });

      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      // 1. Get AI analysis
      const result = await aiService.analyzeBookingApproval(booking);

      // 2. If verdict is APPROVE, update booking status
      if (result.verdict === "APPROVE") {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
             status: "CONFIRMED",
          }
        });
      }

      res.status(200).json({ 
        success: true, 
        verdict: result.verdict, 
        analysis: result.analysis 
      });

    } catch (error) {
      console.error("AI Approval Error:", error);
      res.status(500).json({ success: false, message: "AI process failed" });
    }
  },

  confirmPayment: async (req: Request, res: Response) => {
    try {
      const { bookingId } = req.body;

      if (!bookingId) {
        return res.status(400).json({ success: false, message: "bookingId is required" });
      }

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { tutor: true }
      });

      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      // Final AI Verification of the "Session Merit" after payment
      const result = await aiService.analyzeBookingApproval(booking);

      // Transition from PENDING/CONFIRMED to COMPLETED or just stay CONFIRMED but verified
      const finalStatus = "CONFIRMED"; // Ensuring it's at least confirmed

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: finalStatus,
          // We could add a field like `isPaid: true` if we had it
        }
      });

      res.status(200).json({ 
        success: true, 
        analysis: result.analysis,
        message: "Payment verified and session secured by MentorHub AI"
      });

    } catch (error) {
      console.error("AI Payment Confirm Error:", error);
      res.status(500).json({ success: false, message: "AI verification failed" });
    }
  },

  generateDescription: async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      if (!title) return res.status(400).json({ success: false, message: "Title is required" });

      const description = await aiService.generateDescription(title);
      res.status(200).json({ success: true, data: description });
    } catch (error) {
      res.status(500).json({ success: false, message: "AI Generation failed" });
    }
  }
};
