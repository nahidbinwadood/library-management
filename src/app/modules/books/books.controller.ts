import { NextFunction, Request, Response } from 'express';
import { Books } from './books.model';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };

    if (payload.copies === 0) {
      payload.available = false;
    }
    const book = await Books.create(payload);

    const responseData = {
      _id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      description: book.description,
      copies: book.copies,
      available: book.available,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  const { filter, sortBy, sort, limit = 10 } = req.query;

  try {
    // Build match stage for filtering
    const matchStage: { [key: string]: any } = {};

    if (filter) {
      matchStage.genre = filter as string;
    }

    // Build sort stage
    const sortStage: { [key: string]: 1 | -1 } = {};
    if (sortBy && sort) {
      const sortField = sortBy as string;
      const sortDirection = sort === 'desc' ? -1 : 1;
      sortStage[sortField] = sortDirection;
    }

    // Build aggregation pipeline
    const pipeline: any[] = [];

    // Add match stage if there are filters
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Add sort stage if specified
    if (Object.keys(sortStage).length > 0) {
      pipeline.push({ $sort: sortStage });
    }

    // Add limit stage
    pipeline.push({ $limit: parseInt(limit as string) });

    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        author: 1,
        genre: 1,
        isbn: 1,
        description: 1,
        copies: 1,
        available: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    });

    const response = await Books.aggregate(pipeline);

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;

  try {
    const response = await Books.findById(bookId);
    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;
  const payload = req.body;

  let updatedPayload = { ...payload };
  if (payload?.copies > 0) {
    updatedPayload = { ...payload, available: true };
  }

  try {
    const response = await Books.findByIdAndUpdate(
      bookId,
      { ...updatedPayload },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );
    res.status(201).json({
      success: true,
      message: 'Book updated successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const { bookId } = req.params;

  try {
    const deletedBook = await Books.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export { createBook, deleteBook, getAllBooks, getBookById, updateBook };
