import Router from '@koa/router';
import userRoutes from './user.routes';
import levelRoutes from './level.routes';
import questionRoutes from './question.routes';
import shopRoutes from './shop.routes';
import rankRoutes from './rank.routes';
import feedbackRoutes from './feedback.routes';
import adminAuthRoutes from './admin/auth.routes';
import adminUserRoutes from './admin/user.routes';
import adminLevelRoutes from './admin/level.routes';
import adminRegionRoutes from './admin/region.routes';
import adminCountryRoutes from './admin/country.routes';
import adminProvinceRoutes from './admin/province.routes';
import adminCityRoutes from './admin/city.routes';
import adminQuestionRoutes from './admin/question.routes';
import adminShopRoutes from './admin/shop.routes';
import adminRankRoutes from './admin/rank.routes';
import adminFeedbackRoutes from './admin/feedback.routes';
import adminDashboardRoutes from './admin/dashboard.routes';

const router = new Router({
  prefix: '/api/v1',
});

router.use('/user', userRoutes.routes(), userRoutes.allowedMethods());
router.use('/level', levelRoutes.routes(), levelRoutes.allowedMethods());
router.use('/question', questionRoutes.routes(), questionRoutes.allowedMethods());
router.use('/shop', shopRoutes.routes(), shopRoutes.allowedMethods());
router.use('/rank', rankRoutes.routes(), rankRoutes.allowedMethods());
router.use('/feedback', feedbackRoutes.routes(), feedbackRoutes.allowedMethods());

router.use('/admin/auth', adminAuthRoutes.routes(), adminAuthRoutes.allowedMethods());
router.use('/admin/users', adminUserRoutes.routes(), adminUserRoutes.allowedMethods());
router.use('/admin/levels', adminLevelRoutes.routes(), adminLevelRoutes.allowedMethods());
router.use('/admin/regions', adminRegionRoutes.routes(), adminRegionRoutes.allowedMethods());
router.use('/admin/countries', adminCountryRoutes.routes(), adminCountryRoutes.allowedMethods());
router.use('/admin/provinces', adminProvinceRoutes.routes(), adminProvinceRoutes.allowedMethods());
router.use('/admin/cities', adminCityRoutes.routes(), adminCityRoutes.allowedMethods());
router.use('/admin/questions', adminQuestionRoutes.routes(), adminQuestionRoutes.allowedMethods());
router.use('/admin/shop', adminShopRoutes.routes(), adminShopRoutes.allowedMethods());
router.use('/admin/rank', adminRankRoutes.routes(), adminRankRoutes.allowedMethods());
router.use('/admin/feedback', adminFeedbackRoutes.routes(), adminFeedbackRoutes.allowedMethods());
router.use('/admin/dashboard', adminDashboardRoutes.routes(), adminDashboardRoutes.allowedMethods());

router.get('/health', async (ctx) => {
  ctx.body = {
    code: 0,
    message: 'ok',
    data: {
      status: 'healthy',
      timestamp: Date.now(),
    },
    timestamp: Date.now(),
  };
});

export default router;
