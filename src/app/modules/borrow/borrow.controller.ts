import { NextFunction, Request, Response } from 'express';
import Borrow from './borrow.model';

const borrowABook = async (req: Request, res: Response, next: NextFunction) => {
  const payloads = req.body;
  try {
    const borrow = new Borrow(payloads);
    const response = await borrow.save();
    // const response = await Borrow.create(payloads);
    const modifiedData = {
      _id: response.id,
      book: payloads.book,
      quantity: payloads.quantity,
      dueDate: payloads.dueDate,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
    if (response) {
      res.status(201).json({
        success: true,
        message: 'Book borrowed successfully',
        data: modifiedData,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllBorrows = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          _id: 0,
          book: {
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn',
          },
          totalQuantity: '$totalQuantity',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
export { borrowABook, getAllBorrows };
