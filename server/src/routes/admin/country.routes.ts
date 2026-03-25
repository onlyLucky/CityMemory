import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import { validate } from '../../middlewares/validate.middleware';
import Joi from 'joi';
import AdminCountryController from '../../controllers/admin/country.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminCountryController.getCountryList);

router.get('/:countryId', adminAuthMiddleware, AdminCountryController.getCountryDetail);

router.post(
  '/',
  adminAuthMiddleware,
  validate(
    Joi.object({
      countryName: Joi.string().min(1).max(50).required(),
      countryNameEn: Joi.string().max(50),
      countryCode: Joi.string().max(10),
      flagImage: Joi.string(),
      description: Joi.string().max(255),
      regionId: Joi.number().required(),
      sortOrder: Joi.number(),
    }),
  ),
  AdminCountryController.createCountry,
);

router.put(
  '/:countryId',
  adminAuthMiddleware,
  validate(
    Joi.object({
      countryName: Joi.string().min(1).max(50),
      countryNameEn: Joi.string().max(50),
      countryCode: Joi.string().max(10),
      flagImage: Joi.string(),
      description: Joi.string().max(255),
      regionId: Joi.number(),
      sortOrder: Joi.number(),
      status: Joi.number().valid(0, 1),
    }),
  ),
  AdminCountryController.updateCountry,
);

router.delete('/:countryId', adminAuthMiddleware, AdminCountryController.deleteCountry);

router.get('/by-region/:regionId', adminAuthMiddleware, AdminCountryController.getCountriesByRegion);

export default router;
