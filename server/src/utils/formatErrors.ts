import { ValidationErrors } from './serializeValidationError';

export const formatErrors = (errors: ValidationErrors[]) => {
  const error: any = {};
  errors.forEach((e) => {
    error[e.field] = [e.message];
  });
  return error;
};
