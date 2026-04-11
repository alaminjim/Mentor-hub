import { Request, Response } from "express";
import { BlogService } from "./blog.service";

const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, category, image } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User session not found",
      });
    }

    const authorId = req.user.id;

    const data = {
      title,
      content,
      category: category || "General",
      image: image || null,
      authorId,
    };

    const result = await BlogService.createBlog(data);

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Blog created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error creating blog:", error.message);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
};

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const result = await BlogService.getAllBlogs();

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Blogs fetched successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error fetching blogs:", error.message);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

const getBlogsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const result = await BlogService.getBlogsByCategory(category as string);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Blogs by category fetched successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error fetching blogs by category:", error.message);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error fetching blogs by category",
      error: error.message,
    });
  }
};

const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await BlogService.getBlogById(id as string);

    if (!result) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Blog not found",
        data: null,
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Blog fetched successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error fetching blog:", error.message);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

const getBlogByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;

    const result = await BlogService.getBlogByAuthorId(authorId as string);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Author blogs fetched successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error fetching author blogs:", error.message);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error fetching author blogs",
      error: error.message,
    });
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category, image } = req.body;

    // Check if blog exists
    const existingBlog = await BlogService.getBlogById(id as string);
    if (!existingBlog) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Blog not found",
        data: null,
      });
    }

    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
      ...(category && { category }),
      ...(image !== undefined && { image }),
      updatedAt: new Date(),
    };

    const result = await BlogService.updateBlog(id as string, updateData);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Blog updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error updating blog:", error.message);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingBlog = await BlogService.getBlogById(id as string);
    if (!existingBlog) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Blog not found",
        data: null,
      });
    }

    const result = await BlogService.deleteBlog(id as string);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Blog deleted successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error deleting blog:", error.message);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

const searchBlogs = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;

    const result = await BlogService.searchBlogs(searchTerm as string);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Blogs searched successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error searching blogs:", error.message);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error searching blogs",
      error: error.message,
    });
  }
};


export const BlogController = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogByAuthorId,
  updateBlog,
  deleteBlog,
  searchBlogs,
  getBlogsByCategory,
};
