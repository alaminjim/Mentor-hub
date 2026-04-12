import { prisma } from "../../lib/prisma.js";

const toggleBookmark = async (userId: string, tutorId: string) => {
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_tutorId: {
        userId,
        tutorId,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
    return { bookmarked: false, message: "Removed from bookmarks" };
  } else {
    await prisma.bookmark.create({
      data: {
        userId,
        tutorId,
      },
    });
    return { bookmarked: true, message: "Added to bookmarks" };
  }
};

const getBookmarksByUser = async (userId: string) => {
  return await prisma.bookmark.findMany({
    where: { userId },
    select: {
      tutorId: true,
    },
  });
};

export const BookmarkService = {
  toggleBookmark,
  getBookmarksByUser,
};
