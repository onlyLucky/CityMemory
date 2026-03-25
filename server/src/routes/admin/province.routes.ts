import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import { validate } from '../../middlewares/validate.middleware';
import Joi from 'joi';
import AdminProvinceController from '../../controllers/admin/province.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminProvinceController.getProvinceList);

router.get('/:provinceId', adminAuthMiddleware, AdminProvinceController.getProvinceDetail);

router.post(
  '/',
  adminAuthMiddleware,
  validate(
    Joi.object({
      provinceName: Joi.string().min(1).max(50).required(),
      provinceNameEn: Joi.string().max(50),
      description: Joi.string().max(255),
      countryId: Joi.number().required(),
      sortOrder: Joi.number(),
    }),
  ),
  AdminProvinceController.createProvince,
);

router.put(
  '/:provinceId',
  adminAuthMiddleware,
  validate(
    Joi.object({
      provinceName: Joi.string().min(1).max(50),
      provinceNameEn: Joi.string().max(50),
      description: Joi.string().max(255),
      countryId: Joi.number(),
      sortOrder: Joi.number(),
      status: Joi.number().valid(0, 1),
    }),
  ),
  AdminProvinceController.updateProvince,
);

router.delete('/:provinceId', adminAuthMiddleware, AdminProvinceController.deleteProvince);

router.get('/by-country/:countryId', adminAuthMiddleware, AdminProvinceController.getProvincesByCountry);

export default router;
