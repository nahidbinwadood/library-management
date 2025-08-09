import express from 'express';
import booksRoutes from '../modules/books/books.route';
import borrowRoutes from '../modules/borrow/borrow.api';

const router = express.Router();

router.use('/books', booksRoutes);
router.use('/borrow', borrowRoutes);

export default router;
