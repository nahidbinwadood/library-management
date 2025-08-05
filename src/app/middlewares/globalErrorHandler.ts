import { NextFunction, Request, Response } from 'express';
import { handleMongooseError } from '../errors/handleMongooseError';

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    statusCode,
    message,
    error: formattedError,
  } = handleMongooseError(error);

  res.status(statusCode).json({
    success: false,
    message,
    error: formattedError,
  });
};
