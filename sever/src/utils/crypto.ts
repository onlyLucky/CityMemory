import crypto from 'crypto';

export const cryptoUtil = {
  md5: (text: string): string => {
    return crypto.createHash('md5').update(text).digest('hex');
  },

  sha256: (text: string): string => {
    return crypto.createHash('sha256').update(text).digest('hex');
  },

  randomString: (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex');
  },

  generateId: (): string => {
    return crypto.randomUUID();
  },
};
