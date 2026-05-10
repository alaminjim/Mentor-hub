import { Request, Response } from "express";
import { dashboardService } from "./dashboard.service.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia" as any,
});

export const dashboardController = {
  createProductCheckout: async (req: Request, res: Response) => {
    try {
      const { productId, successUrl, cancelUrl } = req.body;
      const user = req.user;

      if (!productId) return res.status(400).json({ success: false, message: "Product ID required" });

      // Find the product
      const product = await (dashboardService as any).getAllProducts().then((ps: any[]) => ps.find(p => p.id === productId));

      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.title,
                description: product.description.slice(0, 100),
              },
              unit_amount: Math.round(product.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: user?.id as string,
        metadata: {
          productId: productId as string,
          userId: (user?.id || "guest") as string,
        },
      });

      res.status(200).json({ success: true, data: { url: session.url } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getStats: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const role = user.role as string;
      let stats;

      if (role === "ADMIN") stats = await dashboardService.getAdminStats();
      else if (role === "TUTOR") stats = await dashboardService.getTutorStats(user.id);
      else if (role === "MANAGER") stats = await dashboardService.getManagerStats();
      else if (role === "VENDOR") stats = await dashboardService.getVendorStats(user.id);
      else if (role === "ORGANIZER") stats = await dashboardService.getOrganizerStats();
      else stats = await dashboardService.getUserStats(user.id); // STUDENT

      return res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const updated = await dashboardService.updateProfile(user.id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getPlatformUsers: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      if (user.role !== "MANAGER" && user.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
      const users = await dashboardService.getPlatformUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  toggleUserBan: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      if (user.role !== "MANAGER" && user.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
      const { id, currentStatus } = req.body;
      const updatedUser = await dashboardService.toggleUserBan(id, currentStatus);
      res.status(200).json({ success: true, data: updatedUser, message: `User status changed to ${updatedUser.status}` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getEvents: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const events = await dashboardService.getEvents(user.id);
      res.status(200).json({ success: true, data: events });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createEvent: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const data = { ...req.body, organizerId: user.id };
      const event = await dashboardService.createEvent(data);
      res.status(201).json({ success: true, data: event });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteEvent: async (req: Request, res: Response) => {
    try {
      await dashboardService.deleteEvent(req.params.id as string);
      res.status(200).json({ success: true, message: "Event deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getAllBookings: async (req: Request, res: Response) => {
    try {
      const bookings = await dashboardService.getAllBookings();
      res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateBookingStatus: async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const updated = await dashboardService.updateBookingStatus(req.params.id as string, status);
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProducts: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const products = await dashboardService.getProducts(user.id);
      res.status(200).json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createProduct: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const product = await dashboardService.createProduct({
        ...req.body,
        vendorId: user.id
      });
      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    try {
      await dashboardService.deleteProduct(req.params.id as string);
      res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await dashboardService.updateProduct(id as string, req.body);
      res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getPurchasedProducts: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const products = await dashboardService.getPurchasedProducts(user.id);
      res.status(200).json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getStudentBookmarks: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const data = await dashboardService.getStudentBookmarks(user.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getAllEventsPublic: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const data = await dashboardService.getAllEventsPublic(page, limit);
      res.status(200).json({ success: true, ...data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getEventByIdPublic: async (req: Request, res: Response) => {
    try {
      const data = await dashboardService.getEventByIdPublic(req.params.id as string);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  toggleEventRegistration: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const { eventId } = req.body;
      const data = await dashboardService.toggleEventRegistration(user.id, eventId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  toggleEventBookmark: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const { eventId } = req.body;
      const data = await dashboardService.toggleEventBookmark(user.id, eventId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getEventStatusForUser: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const { id: eventId } = req.params;
      const data = await dashboardService.getEventStatusForUser(user.id, eventId as string);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getJoinedEvents: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const data = await dashboardService.getJoinedEvents(user.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getSavedEvents: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const data = await dashboardService.getSavedEvents(user.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getAllProducts: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const products = await dashboardService.getAllProducts(user?.id);
      res.status(200).json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProductById: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const { id } = req.params;
      const product = await dashboardService.getProductById(id as string, user?.id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  confirmProductPurchase: async (req: Request, res: Response) => {
    try {
      const { user } = req as any;
      const { productId } = req.body;
      if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

      const purchase = await dashboardService.confirmProductPurchase(user.id, productId);
      res.status(200).json({ success: true, data: purchase, message: "Purchase verified successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  toggleProductBookmark: async (req: Request, res: Response) => {
    try {
      const { productId } = req.body;
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

      const result = await dashboardService.toggleProductBookmark(user.id, productId);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProductBookmarks: async (req: Request, res: Response) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

      const bookmarks = await dashboardService.getProductBookmarks(user.id);
      res.status(200).json({ success: true, data: bookmarks });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
