import Joi from 'joi';

export const validateEmail = (email: string): boolean => {
  const schema = Joi.string().email();
  const { error } = schema.validate(email);
  return !error;
};

export const validatePhone = (phone: string): boolean => {
  const schema = Joi.string().pattern(/^1[3-9]\d{9}$/);
  const { error } = schema.validate(phone);
  return !error;
};

export const validatePassword = (password: string): boolean => {
  const schema = Joi.string().min(6).max(50);
  const { error } = schema.validate(password);
  return !error;
};

export const validateUsername = (username: string): boolean => {
  const schema = Joi.string().alphanum().min(3).max(20);
  const { error } = schema.validate(username);
  return !error;
};

export const validateObjectId = (id: string): boolean => {
  const schema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
  const { error } = schema.validate(id);
  return !error;
};

export const validateOpenid = (openid: string): boolean => {
  const schema = Joi.string().min(1).max(64);
  const { error } = schema.validate(openid);
  return !error;
};

export const validatePagination = (page: number, pageSize: number): { valid: boolean; message?: string } => {
  if (page < 1) {
    return { valid: false, message: '页码必须大于0' };
  }
  if (pageSize < 1 || pageSize > 100) {
    return { valid: false, message: '每页数量必须在1-100之间' };
  }
  return { valid: true };
};

export const validateId = (id: number | string): boolean => {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
};

export const validateStatus = (status: number, validStatuses: number[]): boolean => {
  return validStatuses.includes(status);
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return !isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end;
};
