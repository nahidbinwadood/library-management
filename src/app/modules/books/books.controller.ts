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

const getAllBooks = async (req: Request, res: Response) => {
  try {
    const response = await Books.find();
    res.status(201).json({
      success: true,
      message: 'Books retrieved successfully',
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error,
    });
  }
};
export { createBook, getAllBooks };
