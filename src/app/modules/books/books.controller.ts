import { NextFunction, Request, Response } from 'express';
import { Books } from './books.model';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;

  try {
    const response = await Books.create(payload);
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: response,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await Books.find();
    res.status(201).json({
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
    res.status(201).json({
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

  try {
    const response = await Books.findByIdAndUpdate(bookId, payload, {
      new: true,
    });
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
    await Books.findByIdAndDelete(bookId);
    res.status(201).json({
      success: true,
      message: 'Book deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
export { createBook, deleteBook, getAllBooks, getBookById, updateBook };
