import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '@/constants/config';

export const jwtUtil = {
  sign: (payload: any): string => {
    return jwt.sign(payload, JWT_CONFIG.secret, {
      expiresIn: JWT_CONFIG.expiresIn,
    });
  },

  verify: (token: string): any => {
    try {
      return jwt.verify(token, JWT_CONFIG.secret);
    } catch (error) {
      throw new Error('Token验证失败');
    }
  },

  decode: (token: string): any => {
    return jwt.decode(token);
  },
};
