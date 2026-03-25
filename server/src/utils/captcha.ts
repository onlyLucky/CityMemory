import svgCaptcha from 'svg-captcha';
import { v4 as uuidv4 } from 'uuid';
import { redisUtils } from '../database/redis';

export interface CaptchaData {
  captchaId: string;
  captchaSvg: string;
}

export const generateCaptcha = async (): Promise<CaptchaData> => {
  const captcha = svgCaptcha.create({
    size: 4,
    noise: 2,
    color: true,
    background: '#f0f0f0',
    width: 120,
    height: 40,
  });

  const captchaId = uuidv4();
  const ttl = 300;

  await redisUtils.set(`captcha:${captchaId}`, captcha.text.toLowerCase(), ttl);

  return {
    captchaId,
    captchaSvg: captcha.data,
  };
};

export const verifyCaptcha = async (captchaId: string, code: string): Promise<boolean> => {
  const key = `captcha:${captchaId}`;
  const storedCode = await redisUtils.get<string>(key);

  if (!storedCode) {
    return false;
  }

  await redisUtils.del(key);

  return storedCode.toLowerCase() === code.toLowerCase();
};
