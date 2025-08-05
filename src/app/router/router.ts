import express from 'express';
import booksRoutes from '../modules/books/books.route';

const router = express.Router();

router.use('/books', booksRoutes);

export default router;
