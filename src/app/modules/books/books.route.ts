import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getAllBooks,
  getAllBooksDemo,
  getBookById,
  updateBook,
} from './books.controller';

const booksRoutes = Router();

booksRoutes.get('/', getAllBooks);
booksRoutes.post('/', createBook);
booksRoutes.get('/:bookId', getBookById);
booksRoutes.put('/:bookId', updateBook);
booksRoutes.delete('/:bookId', deleteBook);
booksRoutes.get('/new', getAllBooksDemo);

export default booksRoutes;
