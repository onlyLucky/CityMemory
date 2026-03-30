import { Context } from 'koa';
import ShopService from '../../services/shop/shop.service';
import { success } from '../../utils/response';

/**
 * @swagger
 * tags:
 *   name: 商店模块
 *   description: 商店相关接口
 */
class ShopController {
  /**
   * @swagger
   * /api/v1/shop/items:
   *   get:
   *     tags:
   *       - 商店模块
   *     summary: 获取商品列表
   *     description: 获取商店中所有可购买的商品
   *     responses:
   *       200:
   *         description: 成功获取商品列表
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/ShopItem'
   */
  async getShopItems(ctx: Context) {
    const items = await ShopService.getItems();
    success(ctx, items);
  }

  /**
   * @swagger
   * /api/v1/shop/buy:
   *   post:
   *     tags:
   *       - 商店模块
   *     summary: 购买商品
   *     description: 使用星星购买商品
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - itemId
   *             properties:
   *               itemId:
   *                 type: integer
   *                 description: 商品ID
   *                 example: 1
   *               quantity:
   *                 type: integer
   *                 description: 购买数量
   *                 default: 1
   *                 example: 1
   *     responses:
   *       200:
   *         description: 购买成功
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         itemId:
   *                           type: integer
   *                           description: 商品ID
   *                         quantity:
   *                           type: integer
   *                           description: 购买数量
   *                         balance:
   *                           type: integer
   *                           description: 剩余星星数量
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       400:
   *         description: 星星不足或商品已售罄
   */
  async purchaseItem(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
      itemId: number;
      quantity: number;
    };
    const result = await ShopService.buyItem(userId, data.itemId, data.quantity || 1);
    success(ctx, result, '购买成功');
  }

  /**
   * @swagger
   * /api/v1/shop/exchange:
   *   post:
   *     tags:
   *       - 商店模块
   *     summary: 兑换商品
   *     description: 使用星星兑换道具
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - itemId
   *             properties:
   *               itemId:
   *                 type: integer
   *                 description: 商品ID
   *                 example: 1
   *               quantity:
   *                 type: integer
   *                 description: 兑换数量
   *                 default: 1
   *                 example: 1
   *     responses:
   *       200:
   *         description: 兑换成功
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         itemId:
   *                           type: integer
   *                         quantity:
   *                           type: integer
   *                         balance:
   *                           type: integer
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  async exchangeStars(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
      itemId: number;
      quantity: number;
    };
    const result = await ShopService.buyItem(userId, data.itemId, data.quantity || 1);
    success(ctx, result, '兑换成功');
  }
}

export default new ShopController();
