import { prisma } from "../../lib/prisma";

export const dashboardService = {

  // ─── ADMIN ───────────────────────────────────────────────────────────────────
  getAdminStats: async () => {
    const [totalUsers, totalTutors, totalBlogs, totalBookings, revenueData, recentBookings] =
      await Promise.all([
        prisma.user.count(),
        prisma.tutorProfile.count(),
        prisma.blog.count(),
        prisma.booking.count(),
        prisma.booking.aggregate({ where: { status: "COMPLETED" }, _sum: { totalPrice: true } }),
        prisma.booking.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { student: true, tutor: true },
        }),
      ]);

    const revenue = Number(revenueData._sum.totalPrice || 0);

    // Monthly revenue for bar chart (last 6 months)
    const monthlyRevenue: any[] = await prisma.$queryRaw`
      SELECT TO_CHAR("createdAt", 'Mon') as month,
             TO_CHAR("createdAt", 'MM') as month_num,
             COALESCE(SUM("totalPrice"), 0) as amount
      FROM "Booking"
      WHERE status = 'COMPLETED'
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month, month_num
      ORDER BY month_num ASC
    `;

    // Pie chart — booking status distribution
    const [completed, pending, cancelled] = await Promise.all([
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
    ]);

    return {
      stats: [
        { label: "Total Users", value: totalUsers, growth: "+12%", icon: "users" },
        { label: "Total Revenue", value: `$${revenue.toFixed(0)}`, growth: "+8%", icon: "dollar" },
        { label: "Active Tutors", value: totalTutors, growth: "+5%", icon: "check" },
        { label: "Total Bookings", value: totalBookings, growth: "+18%", icon: "book" },
        { label: "Blog Posts", value: totalBlogs, growth: "+15%", icon: "file" },
      ],
      charts: {
        revenue: monthlyRevenue.map((r: any) => ({
          month: r.month,
          amount: Number(r.amount),
        })),
        distribution: [
          { name: "Completed", value: completed },
          { name: "Pending", value: pending },
          { name: "Cancelled", value: cancelled },
        ],
      },
      recentActivity: recentBookings,
    };
  },

  // ─── STUDENT ─────────────────────────────────────────────────────────────────
  getUserStats: async (userId: string) => {
    const [totalBookings, completedBookings, totalSpentData, purchaseCount, purchaseSpentData, recentBookings, recentPurchases, joinedCount, savedCount] = await Promise.all([
      prisma.booking.count({ where: { studentId: userId } }),
      prisma.booking.count({ where: { studentId: userId, status: "COMPLETED" } }),
      prisma.booking.aggregate({
        where: { studentId: userId, status: "COMPLETED" },
        _sum: { totalPrice: true },
      }),
      (prisma as any).purchase.count({ where: { userId } }),
      (prisma as any).purchase.aggregate({
        where: { userId, status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.booking.findMany({
        where: { studentId: userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { tutor: true },
      }),
      (prisma as any).purchase.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { product: true }
      }),
      (prisma as any).eventRegistration.count({ where: { userId } }),
      (prisma as any).eventBookmark.count({ where: { userId } }),
    ]);

    const totalSpent = Number(totalSpentData._sum.totalPrice || 0) + Number(purchaseSpentData._sum.amount || 0);

    return {
      stats: [
        { label: "Bookings", value: totalBookings, icon: "calendar" },
        { label: "Events Joined", value: joinedCount, icon: "check" },
        { label: "Events Saved", value: savedCount, icon: "star" },
        { label: "My Products", value: purchaseCount, icon: "book" },
        { label: "Total Investment", value: `$${totalSpent.toFixed(0)}`, icon: "dollar" },
      ],
      charts: {
        distribution: [
          { name: "Sessions", value: totalBookings },
          { name: "Products", value: purchaseCount },
        ],
        trend: [
          { month: "Apr", bookings: totalBookings, products: purchaseCount },
        ],
      },
      recentActivity: [
        ...recentBookings.map((b: any) => ({ ...b, type: "BOOKING" })),
        ...recentPurchases.map((p: any) => ({ ...p, title: p.product?.title, type: "PURCHASE" }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
    };
  },

  // ─── TUTOR ────────────────────────────────────────────────────────────────────
  getTutorStats: async (userId: string) => {
    const tutorProfile = await prisma.tutorProfile.findFirst({ where: { userId } });
    const tutorId = tutorProfile?.id;

    const [totalSessions, completedSessions, earnedData, reviews, recentSessions] = await Promise.all([
      tutorId ? prisma.booking.count({ where: { tutorId } }) : Promise.resolve(0),
      tutorId ? prisma.booking.count({ where: { tutorId, status: "COMPLETED" } }) : Promise.resolve(0),
      tutorId ? prisma.booking.aggregate({ where: { tutorId, status: "COMPLETED" }, _sum: { totalPrice: true } }) : Promise.resolve({ _sum: { totalPrice: 0 } }),
      tutorId ? prisma.review.findMany({ where: { tutorId }, take: 5, orderBy: { createdAt: "desc" } }) : Promise.resolve([]),
      tutorId ? prisma.booking.findMany({ where: { tutorId }, take: 8, orderBy: { createdAt: "desc" }, include: { student: true } }) : Promise.resolve([]),
    ]);

    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    const pending = tutorId ? await prisma.booking.count({ where: { tutorId, status: "PENDING" } }) : 0;

    return {
      stats: [
        { label: "Total Sessions", value: totalSessions, icon: "book" },
        { label: "Total Earned", value: `$${Number(earnedData._sum.totalPrice || 0).toFixed(0)}`, icon: "dollar" },
        { label: "Avg Rating", value: avgRating.toFixed(1), icon: "star" },
        { label: "Pending", value: pending, icon: "clock" },
      ],
      charts: {
        distribution: [
          { name: "Completed", value: completedSessions },
          { name: "Pending", value: pending },
          { name: "Cancelled", value: Math.max(0, totalSessions - completedSessions - pending) },
        ],
        trend: [
          { month: "Jan", sessions: 2 }, { month: "Feb", sessions: 5 },
          { month: "Mar", sessions: 4 }, { month: "Apr", sessions: completedSessions },
        ],
      },
      recentActivity: recentSessions,
    };
  },

  // ─── MANAGER ─────────────────────────────────────────────────────────────────
  getManagerStats: async () => {
    const [totalUsers, totalBookings, revenue, totalTutors] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({ where: { status: "COMPLETED" }, _sum: { totalPrice: true } }),
      prisma.tutorProfile.count(),
    ]);

    const [completed, pending, cancelled] = await Promise.all([
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
    ]);

    const recentUsers = await prisma.user.findMany({
      take: 8, orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const monthlyData: any[] = await prisma.$queryRaw`
      SELECT TO_CHAR("createdAt", 'Mon') as month,
             COUNT(*) as total
      FROM "Booking"
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month, TO_CHAR("createdAt", 'MM')
      ORDER BY TO_CHAR("createdAt", 'MM') ASC
    `;

    return {
      stats: [
        { label: "Platform Users", value: totalUsers, growth: "+12%", icon: "users" },
        { label: "Total Revenue", value: `$${Number(revenue._sum.totalPrice || 0).toFixed(0)}`, growth: "+8%", icon: "dollar" },
        { label: "Total Bookings", value: totalBookings, growth: "+20%", icon: "book" },
        { label: "Active Tutors", value: totalTutors, growth: "+5%", icon: "check" },
      ],
      charts: {
        revenue: monthlyData.map((r: any) => ({ month: r.month, total: Number(r.total) })),
        distribution: [
          { name: "Completed", value: completed },
          { name: "Pending", value: pending },
          { name: "Cancelled", value: cancelled },
        ],
      },
      recentActivity: recentUsers,
    };
  },

  // ─── VENDOR ──────────────────────────────────────────────────────────────────
  getVendorStats: async (userId: string) => {
    const [totalProducts, totalSalesCount, revenueData, recentBlogs] = await Promise.all([
      prisma.product.count({ where: { vendorId: userId } }),
      (prisma as any).purchase.count({ where: { product: { vendorId: userId } } }),
      (prisma as any).purchase.aggregate({
        where: { product: { vendorId: userId }, status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.blog.findMany({
        where: { authorId: userId },
        take: 8, orderBy: { createdAt: "desc" },
      }),
    ]);

    const revenue = Number(revenueData._sum.amount || 0);

    return {
      stats: [
        { label: "My Products", value: totalProducts, icon: "package" },
        { label: "Total Sales", value: totalSalesCount, icon: "check" },
        { label: "Total Earnings", value: `$${revenue.toFixed(0)}`, icon: "dollar" },
        { label: "Blog Content", value: recentBlogs.length, icon: "file" },
      ],
      charts: {
        distribution: [
          { name: "Products", value: totalProducts },
          { name: "Sales", value: totalSalesCount },
        ],
        trend: [
          { month: "Apr", items: totalProducts, sales: totalSalesCount },
        ],
      },
      recentActivity: recentBlogs.map((b: any) => ({ ...b, type: "BLOG" })),
    };
  },

  // ─── ORGANIZER ───────────────────────────────────────────────────────────────
  getOrganizerStats: async () => {
    const [totalUsers, totalTutors, totalBookings] = await Promise.all([
      prisma.user.count(),
      prisma.tutorProfile.count(),
      prisma.booking.count(),
    ]);

    const [completed, pending] = await Promise.all([
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
    ]);

    const recentBookings = await prisma.booking.findMany({
      take: 8, orderBy: { createdAt: "desc" },
      include: { student: true, tutor: true },
    });

    return {
      stats: [
        { label: "Total Attendees", value: totalUsers, icon: "users" },
        { label: "Active Tutors", value: totalTutors, icon: "check" },
        { label: "Events Hosted", value: totalBookings, icon: "book" },
        { label: "Completed", value: completed, icon: "star" },
      ],
      charts: {
        distribution: [
          { name: "Completed", value: completed },
          { name: "Upcoming", value: pending },
          { name: "Cancelled", value: Math.max(0, totalBookings - completed - pending) },
        ],
        trend: [
          { month: "Jan", events: 2 }, { month: "Feb", events: 4 },
          { month: "Mar", events: 3 }, { month: "Apr", events: completed },
        ],
      },
      recentActivity: recentBookings,
    };
  },

  // ─── PROFILE UPDATE ──────────────────────────────────────────────────────────
  updateProfile: async (userId: string, data: { name?: string; image?: string; bio?: string; phone?: string }) => {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.image && { image: data.image }),
      },
    });
  },

  // ─── MANAGER ACTIONS ─────────────────────────────────────────────────────────
  toggleUserBan: async (userId: string, currentStatus: string) => {
    // Prevent banning advanced roles
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (targetUser && ["ADMIN", "MANAGER", "VENDOR", "ORGANIZER"].includes(targetUser.role || "")) {
      throw new Error("Cannot modify status for protected roles.");
    }

    const newStatus = currentStatus === "UnBAN" ? "BANNED" : "UnBAN";
    return await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
      select: { id: true, name: true, email: true, status: true }
    });
  },
  
  getPlatformUsers: async () => {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });
  },

  // ─── ORGANIZER ACTIONS ───────────────────────────────────────────────────────
  getEvents: async (organizerId: string) => {
    return await prisma.event.findMany({
      where: { organizerId },
      orderBy: { date: "asc" },
    });
  },
  
  createEvent: async (data: any) => {
    return await prisma.event.create({ data });
  },
  
  deleteEvent: async (eventId: string) => {
    return await prisma.event.delete({ where: { id: eventId } });
  },

  getAllBookings: async () => {
    return await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { name: true, email: true } },
        tutor: { select: { name: true, user: { select: { email: true } } } },
      }
    });
  },

  updateBookingStatus: async (bookingId: string, status: any) => {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });
  },

  // ─── VENDOR ACTIONS ──────────────────────────────────────────────────────────
  getProducts: async (vendorId: string) => {
    return await prisma.product.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
    });
  },

  createProduct: async (data: any) => {
    return await prisma.product.create({ data });
  },

  updateProduct: async (productId: string, data: any) => {
    return await prisma.product.update({
      where: { id: productId },
      data
    });
  },

  deleteProduct: async (productId: string) => {
    return await prisma.product.delete({ where: { id: productId } });
  },

  getPurchasedProducts: async (userId: string) => {
    const purchases = await (prisma as any).purchase.findMany({
      where: { userId, status: "COMPLETED" },
      include: {
        product: {
          include: { vendor: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return purchases.map((p: any) => ({
      ...p.product,
      purchaseId: p.id,
      purchasedAt: p.createdAt
    }));
  },

  getJoinedEvents: async (userId: string) => {
    return await (prisma as any).eventRegistration.findMany({
      where: { userId },
      include: { event: { include: { organizer: { select: { name: true, image: true } } } } }
    });
  },

  getSavedEvents: async (userId: string) => {
    return await (prisma as any).eventBookmark.findMany({
      where: { userId },
      include: { event: { include: { organizer: { select: { name: true, image: true } } } } }
    });
  },

  getEventStatusForUser: async (userId: string, eventId: string) => {
    const [registration, bookmark] = await Promise.all([
      (prisma as any).eventRegistration.findUnique({ where: { userId_eventId: { userId, eventId } } }),
      (prisma as any).eventBookmark.findUnique({ where: { userId_eventId: { userId, eventId } } }),
    ]);
    return { isRegistered: !!registration, isBookmarked: !!bookmark };
  },

  toggleEventRegistration: async (userId: string, eventId: string) => {
    const existing = await (prisma as any).eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });

    if (existing) {
      await (prisma as any).eventRegistration.delete({ where: { id: existing.id } });
      return { registered: false };
    } else {
      await (prisma as any).eventRegistration.create({ data: { userId, eventId } });
      return { registered: true };
    }
  },

  toggleEventBookmark: async (userId: string, eventId: string) => {
    const existing = await (prisma as any).eventBookmark.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });

    if (existing) {
      await (prisma as any).eventBookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    } else {
      await (prisma as any).eventBookmark.create({ data: { userId, eventId } });
      return { bookmarked: true };
    }
  },

  getStudentBookmarks: async (userId: string) => {
    const [tutors, products] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        include: { tutor: { include: { user: { select: { name: true, image: true, email: true } } } } },
        orderBy: { createdAt: "desc" }
      }),
      prisma.productBookmark.findMany({
        where: { userId },
        include: { product: { include: { vendor: { select: { name: true } } } } },
        orderBy: { createdAt: "desc" }
      })
    ]);

    return { tutors, products };
  },

  getAllEventsPublic: async (page: number = 1, limit: number = 9) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.event.findMany({
        skip,
        take: limit,
        where: { status: { in: ["UPCOMING", "ONGOING"] } },
        orderBy: { date: "asc" },
        include: { organizer: { select: { name: true, image: true, email: true } } }
      }),
      prisma.event.count({
        where: { status: { in: ["UPCOMING", "ONGOING"] } }
      })
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  },

  getEventByIdPublic: async (id: string) => {
    return await prisma.event.findUnique({
      where: { id },
      include: { organizer: { select: { name: true, image: true, email: true } } }
    });
  },

  getAllProducts: async (userId?: string) => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { 
        vendor: { select: { name: true, email: true } },
        _count: { select: { bookmarks: true } },
        ...(userId ? {
          bookmarks: {
            where: { userId }
          }
        } : {})
      },
      orderBy: { createdAt: "desc" }
    });

    if (userId) {
      return products.map((p: any) => ({
        ...p,
        isBookmarked: p.bookmarks.length > 0
      }));
    }
    return products;
  },

  toggleProductBookmark: async (userId: string, productId: string) => {
    const p = prisma as any;
    const existing = await p.productBookmark.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existing) {
      await p.productBookmark.delete({
        where: { id: existing.id }
      });
      return { bookmarked: false };
    } else {
      await p.productBookmark.create({
        data: { userId, productId }
      });
      return { bookmarked: true };
    }
  },

  getProductBookmarks: async (vendorId: string) => {
    // Return bookmarks for products owned by this vendor
    return await (prisma as any).productBookmark.findMany({
      where: {
        product: { vendorId }
      },
      include: {
        user: { select: { name: true, email: true, image: true } },
        product: { select: { title: true, price: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }
};
