import { model, Schema } from 'mongoose';
import { IBooks } from './books.interface';

const booksSchema = new Schema<IBooks>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: {
        values: [
          'FICTION',
          'NON_FICTION',
          'SCIENCE',
          'HISTORY',
          'BIOGRAPHY',
          'FANTASY',
        ],
        message:
          'Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY',
      },
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    copies: {
      type: Number,
      required: [true, 'Copies is required'],
      min: [0, 'Copies must be a positive number'],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Books = model<IBooks>('Books', booksSchema);
