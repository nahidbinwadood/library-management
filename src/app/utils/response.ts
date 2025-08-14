import { Document } from 'mongoose';

export const ResponseData = <
  T extends { _id: any; createdAt?: Date; updatedAt?: Date }
>(
  data: Document & T
) => {
  return {
    ...data.toObject(),
    _id: data._id.toString(),
    createdAt: data.createdAt?.toISOString(),
    updatedAt: data.updatedAt?.toISOString(),
  };
};
