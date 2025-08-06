import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from './books.controller';

const booksRoutes = Router();

booksRoutes.get('/', getAllBooks);
booksRoutes.post('/', createBook);
booksRoutes.get('/:bookId', getBookById);
booksRoutes.put('/:bookId', updateBook);
booksRoutes.delete('/:bookId', deleteBook);

export default booksRoutes;
