import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/stats", auth(), dashboardController.getStats);
router.patch("/profile", auth(), dashboardController.updateProfile);
router.get("/manager/users", auth(), dashboardController.getPlatformUsers);
router.put("/manager/users/ban", auth(), dashboardController.toggleUserBan);

// Organizer Event Management
router.get("/organizer/events", auth(), dashboardController.getEvents);
router.post("/organizer/events", auth(), dashboardController.createEvent);
router.delete("/organizer/events/:id", auth(), dashboardController.deleteEvent);

// Organizer Booking Management
router.get("/organizer/bookings", auth(), dashboardController.getAllBookings);
router.patch("/organizer/bookings/:id", auth(), dashboardController.updateBookingStatus);

// Vendor Product Management
router.get("/vendor/products", auth(), dashboardController.getProducts);
router.post("/vendor/products", auth(), dashboardController.createProduct);
router.patch("/vendor/products/:id", auth(), dashboardController.updateProduct);
router.delete("/vendor/products/:id", auth(), dashboardController.deleteProduct);

// Global Product Routes
router.get("/events/public", dashboardController.getAllEventsPublic);
router.get("/products", auth(), dashboardController.getAllProducts);
router.get("/products/purchased", auth(), dashboardController.getPurchasedProducts);
router.post("/products/bookmark", auth(), dashboardController.toggleProductBookmark);
router.post("/products/checkout", auth(), dashboardController.createProductCheckout);
router.get("/student/bookmarks", auth(), dashboardController.getStudentBookmarks);
router.get("/vendor/bookmarks", auth(), dashboardController.getProductBookmarks);

export const dashboardRoutes = router;
