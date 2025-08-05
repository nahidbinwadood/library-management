import { Router } from 'express';
import { createBook, getAllBooks } from './books.controller';

const booksRoutes = Router();

booksRoutes.get('/', getAllBooks);
booksRoutes.post('/', createBook);

export default booksRoutes;
