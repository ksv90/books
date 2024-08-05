import { ErrorRequestHandler } from 'express';
import { BadRequestError } from 'http-errors-enhanced';
import { ValidationError } from 'sequelize';
import { createCustomErrorHandler } from 'src/core';

export const dataBaseValidationErrorHandler: ErrorRequestHandler = createCustomErrorHandler(
  ValidationError,
  (error, _req, _res, next) => {
    const message = `${error.message}:${error.errors.map((item) => item.message).join(';')}`;
    next(new BadRequestError(message));
  },
);
