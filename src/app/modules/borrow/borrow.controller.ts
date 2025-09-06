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
    const {
      sortBy = 'totalQuantity', // default: sort by most borrowed
      sort = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortStage: Record<string, 1 | -1> = {
      [sortBy as string]: sort === 'desc' ? -1 : 1,
    };

    // Main aggregation
    const pipeline: any[] = [
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
            id: '$bookDetails._id',
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn',
          },
          totalQuantity: 1,
        },
      },
      {
        $facet: {
          data: [{ $sort: sortStage }, { $skip: skip }, { $limit: limitNum }],
          totalCount: [{ $count: 'count' }],
          stats: [
            {
              $group: {
                _id: null,
                uniqueTitlesBorrowed: { $sum: 1 },
                totalBorrowedCopies: { $sum: '$totalQuantity' },
                averageCopiesPerBook: { $avg: '$totalQuantity' },
              },
            },
          ],
        },
      },
    ];

    const result = await Borrow.aggregate(pipeline);

    const data = result[0]?.data || [];
    const total = result[0]?.totalCount?.[0]?.count || 0;
    const totalPages = Math.ceil(total / limitNum);

    // extract stats
    const statsAgg = result[0]?.stats?.[0] || {};
    let mostPopularBook: string | null = null;
    let mostPopularBookCopies: number | null = null;

    // 🔥 find most popular book with its total copies
    const popular = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 1 },
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
          title: '$bookDetails.title',
          totalQuantity: 1,
        },
      },
    ]);

    if (popular.length > 0) {
      mostPopularBook = popular[0].title;
      mostPopularBookCopies = popular[0].totalQuantity;
    }

    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data,
      pagination: {
        total,
        totalPages,
        currentPage: pageNum,
        pageSize: limitNum,
      },
      stats: {
        uniqueTitlesBorrowed: statsAgg.uniqueTitlesBorrowed || 0,
        totalBorrowedCopies: statsAgg.totalBorrowedCopies || 0,
        averageCopiesPerBook: Math.floor(statsAgg.averageCopiesPerBook || 0),
        mostPopularBook,
        mostPopularBookCopies,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { borrowABook, getAllBorrows };
