import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    title: z
      .string("Title is required")
      .min(5, "Title must be at least 5 characters")
      .max(200, "Title must be less than 200 characters"),

    content: z
      .string("Content is required")
      .min(20, "Content must be at least 20 characters")
      .max(10000, "Content must be less than 10000 characters"),

    category: z.string().default("General").optional(),

    image: z.string().url("Invalid image URL").optional().nullable(),

    authorId: z
      .string("Author ID is required")
      .min(1, "Author ID is required"),
  }),
});

export const updateBlogSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(200, "Title must be less than 200 characters")
      .optional(),

    content: z
      .string()
      .min(20, "Content must be at least 20 characters")
      .max(10000, "Content must be less than 10000 characters")
      .optional(),

    category: z.string().optional(),

    image: z.string().url("Invalid image URL").optional().nullable(),
  }),
});

export const blogIdSchema = z.object({
  params: z.object({
    id: z.string("Blog ID is required").min(1, "Blog ID is required"),
  }),
});

export const authorIdSchema = z.object({
  params: z.object({
    authorId: z
      .string("Author ID is required")
      .min(1, "Author ID is required"),
  }),
});

export const categorySchema = z.object({
  params: z.object({
    category: z
      .string("Category is required")
      .min(2, "Category must be at least 2 characters")
      .max(50, "Category must be less than 50 characters"),
  }),
});

export const searchBlogSchema = z.object({
  query: z.object({
    searchTerm: z
      .string("Search term is required")
      .min(2, "Search term must be at least 2 characters")
      .max(100, "Search term must be less than 100 characters"),
  }),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type BlogIdInput = z.infer<typeof blogIdSchema>;
export type AuthorIdInput = z.infer<typeof authorIdSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SearchBlogInput = z.infer<typeof searchBlogSchema>;
