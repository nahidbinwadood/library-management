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
  try {
    const {
      filter,
      sortBy = 'createdAt',
      sort = 'desc',
      page = 1,
      limit = 10,
      search, // optional free text search
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Filtering
    const matchStage: Record<string, any> = {};
    if (filter && filter !== 'all') {
      matchStage.genre = filter;
    }
    if (search) {
      matchStage.title = { $regex: search as string, $options: 'i' };
    }

    // Sorting
    const sortStage: Record<string, 1 | -1> = {
      [sortBy as string]: sort === 'desc' ? -1 : 1,
    };

    // Aggregation pipeline
    const pipeline: any[] = [];

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Facet for data + count + stats
    pipeline.push({
      $facet: {
        data: [
          { $sort: sortStage },
          { $skip: skip },
          { $limit: limitNum },
          {
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
          },
        ],
        totalCount: [{ $count: 'count' }],
        stats: [
          {
            $group: {
              _id: null,
              totalBooks: { $sum: 1 },
              totalCopies: { $sum: { $toInt: { $ifNull: ['$copies', 0] } } },
              borrowed: {
                $sum: {
                  $subtract: [
                    { $toInt: { $ifNull: ['$copies', 0] } },
                    { $toInt: { $ifNull: ['$available', 0] } },
                  ],
                },
              },
              availableBooks: {
                $sum: { $toInt: { $ifNull: ['$available', 0] } },
              },
            },
          },
        ],
      },
    });

    const result = await Books.aggregate(pipeline);

    const books = result[0]?.data || [];
    const total = result[0]?.totalCount?.[0]?.count || 0;
    const totalPages = Math.ceil(total / limitNum);

    const statsAgg = result[0]?.stats?.[0] || {
      totalBooks: 0,
      totalCopies: 0,
      borrowed: 0,
      availableBooks: 0,
    };

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
      pagination: {
        total,
        totalPages,
        currentPage: pageNum,
        pageSize: limitNum,
      },
      stats: {
        totalBooks: statsAgg.totalBooks,
        totalCopies: statsAgg.totalCopies,
        borrowed: statsAgg.borrowed,
        availableBooks: statsAgg.availableBooks,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllBooksDemo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await Books.find();
    console.log(response);
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

export {
  createBook,
  deleteBook,
  getAllBooks,
  getAllBooksDemo,
  getBookById,
  updateBook,
};
