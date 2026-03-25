import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import { validate } from '../../middlewares/validate.middleware';
import Joi from 'joi';
import AdminCityController from '../../controllers/admin/city.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminCityController.getCityList);

router.get('/:cityId', adminAuthMiddleware, AdminCityController.getCityDetail);

router.post(
  '/',
  adminAuthMiddleware,
  validate(
    Joi.object({
      cityName: Joi.string().min(1).max(50).required(),
      cityNameEn: Joi.string().max(50),
      description: Joi.string().max(255),
      latitude: Joi.number(),
      longitude: Joi.number(),
      provinceId: Joi.number().required(),
      sortOrder: Joi.number(),
    }),
  ),
  AdminCityController.createCity,
);

router.put(
  '/:cityId',
  adminAuthMiddleware,
  validate(
    Joi.object({
      cityName: Joi.string().min(1).max(50),
      cityNameEn: Joi.string().max(50),
      description: Joi.string().max(255),
      latitude: Joi.number(),
      longitude: Joi.number(),
      provinceId: Joi.number(),
      sortOrder: Joi.number(),
      status: Joi.number().valid(0, 1),
    }),
  ),
  AdminCityController.updateCity,
);

router.delete('/:cityId', adminAuthMiddleware, AdminCityController.deleteCity);

router.post(
  '/batch-import',
  adminAuthMiddleware,
  validate(
    Joi.object({
      cities: Joi.array()
        .items(
          Joi.object({
            cityName: Joi.string().min(1).max(50).required(),
            cityNameEn: Joi.string().max(50),
            description: Joi.string().max(255),
            latitude: Joi.number(),
            longitude: Joi.number(),
            provinceId: Joi.number().required(),
            sortOrder: Joi.number(),
          }),
        )
        .min(1)
        .required(),
    }),
  ),
  AdminCityController.batchImportCities,
);

router.get('/import-progress/:importId', adminAuthMiddleware, AdminCityController.getImportProgress);

router.get('/by-province/:provinceId', adminAuthMiddleware, AdminCityController.getCitiesByProvince);

export default router;
