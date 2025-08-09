import mongoose, { model, Schema } from 'mongoose';
import { ApiError } from '../../errors/api-error';
import { Books } from '../books/books.model';
import { IBorrowDoc, IBorrowModel } from './borrow.interface';

const borrowSchema = new Schema<IBorrowDoc, IBorrowModel>(
  {
    book: {
      type: Schema.Types.ObjectId,
      required: [true, 'Book Id is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity must be a positive number'],
    },
    dueDate: {
      type: String,
      required: [true, 'Due Date is required'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// static methods=>
borrowSchema.statics.validateBorrow = async function (borrowDoc: IBorrowDoc) {
  const requestedId = borrowDoc.book;
  const requestedQuantity = borrowDoc.quantity;

  const requestedBookDetails = await Books.findById(requestedId);
  if (!requestedBookDetails) {
    throw new ApiError(400, 'Book not found');
  }

  if (!requestedBookDetails?.available) {
    throw new ApiError(400, 'This book is not available for borrow');
  }

  if (requestedBookDetails.copies < requestedQuantity) {
    throw new ApiError(400, 'Requested copies not available');
  }
};

borrowSchema.statics.updateBookAfterBorrow = async function (
  borrowDoc: IBorrowDoc
) {
  const requestedBookId = borrowDoc.book;
  const requestedQuantity = borrowDoc.quantity;
  const requestedBookDetails = await Books.findById(requestedBookId);

  let updatedPayload = {
    copies: 0,
    available: true,
  };
  if (requestedBookDetails) {
    const updatedQuantity = requestedBookDetails?.copies - requestedQuantity;
    if (updatedQuantity == 0) {
      updatedPayload.available = false;
      updatedPayload.copies = updatedQuantity;
      await Books.findByIdAndUpdate(requestedBookId, updatedPayload);
    } else {
      updatedPayload.available = true;
      updatedPayload.copies = updatedQuantity;
      await Books.findByIdAndUpdate(requestedBookId, updatedPayload);
    }
  }
};

// middlewares==>
borrowSchema.pre('save', async function (next) {
  try {
    const model = this.constructor as IBorrowModel;
    await model.validateBorrow(this);
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

borrowSchema.post('save', async function (doc) {
  try {
    const model = doc.constructor as IBorrowModel;
    await model.updateBookAfterBorrow(doc);
  } catch (error) {
    console.error(error);
  }
});

const Borrow = model<IBorrowDoc, IBorrowModel>('Borrow', borrowSchema);
export default Borrow;
