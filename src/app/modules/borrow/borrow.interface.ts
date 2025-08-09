import { Model, Types } from 'mongoose';

export interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBorrowDoc extends IBorrow, Document {}
export interface IBorrowModel extends Model<IBorrow> {
  validateBorrow(borrowDoc: IBorrowDoc): Promise<void>;
  updateBookAfterBorrow(borrowDoc: IBorrowDoc): Promise<void>;
}
