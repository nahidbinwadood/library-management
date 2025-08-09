export const handleMongooseError = (error: any) => {
  // Duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return {
      statusCode: 409,
      message: 'Validation failed',
      error: {
        name: 'DuplicateKeyError',
        message: `${field} must be unique`,
        keyValue: error.keyValue,
      },
    };
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const formattedErrors: Record<string, any> = {};

    for (const field in error.errors) {
      const err = error.errors[field];
      formattedErrors[field] = {
        message: err.message,
        name: err.name,
        properties: {
          message: err.properties?.message,
          type: err.properties?.type,
          min: err.properties?.min,
        },
        kind: err.kind,
        path: err.path,
        value: err.value,
      };
    }

    return {
      statusCode: 400,
      message: 'Validation failed',
      error: {
        name: 'ValidationError',
        errors: formattedErrors,
      },
    };
  }

  // custom api error=>
  if (error.name === 'ApiError') {
    return {
      statusCode: error.statusCode,
      message: error.message,
      error: {
        name: error.name,
        message: error.message,
      },
    };
  }
  // Default fallback
  return {
    statusCode: 500,
    message: 'Something went wrong',
    error: error,
  };
};
