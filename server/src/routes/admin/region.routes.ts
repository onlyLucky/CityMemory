import Router from '@koa/router';
import { adminAuthMiddleware } from '../../middlewares/admin.middleware';
import { validate } from '../../middlewares/validate.middleware';
import Joi from 'joi';
import AdminRegionController from '../../controllers/admin/region.controller';

const router = new Router();

router.get('/', adminAuthMiddleware, AdminRegionController.getRegionList);

router.get('/all', adminAuthMiddleware, AdminRegionController.getAllRegions);

router.get('/:regionId', adminAuthMiddleware, AdminRegionController.getRegionDetail);

router.post(
  '/',
  adminAuthMiddleware,
  validate(
    Joi.object({
      regionName: Joi.string().min(1).max(50).required(),
      regionNameEn: Joi.string().max(50),
      regionType: Joi.number().valid(1, 2, 3).required(),
      description: Joi.string().max(255),
      coverImage: Joi.string(),
      sortOrder: Joi.number(),
    }),
  ),
  AdminRegionController.createRegion,
);

router.put(
  '/:regionId',
  adminAuthMiddleware,
  validate(
    Joi.object({
      regionName: Joi.string().min(1).max(50),
      regionNameEn: Joi.string().max(50),
      regionType: Joi.number().valid(1, 2, 3),
      description: Joi.string().max(255),
      coverImage: Joi.string(),
      sortOrder: Joi.number(),
      status: Joi.number().valid(0, 1),
    }),
  ),
  AdminRegionController.updateRegion,
);

router.delete('/:regionId', adminAuthMiddleware, AdminRegionController.deleteRegion);

export default router;
