import { Router } from 'express';
import { borrowABook, getAllBorrows } from './borrow.controller';

const borrowRoutes = Router();

borrowRoutes.post('/', borrowABook);
borrowRoutes.get('/', getAllBorrows);

export default borrowRoutes;
