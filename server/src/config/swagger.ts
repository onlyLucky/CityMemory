import swaggerJsdoc from 'swagger-jsdoc';
import config from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '城迹 API 文档',
      version: '1.0.0',
      description: '城迹地理知识问答小游戏后端服务 API 接口文档',
      contact: {
        name: 'API Support',
        email: 'support@citymemory.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.app.port}`,
        description: '开发环境',
      },
      {
        url: 'https://api.citymemory.com',
        description: '生产环境',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT 认证，格式: Bearer {token}',
        },
        AdminAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '管理员 JWT 认证',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
              example: 0,
              description: '响应状态码，0 表示成功',
            },
            message: {
              type: 'string',
              example: '操作成功',
              description: '响应消息',
            },
            data: {
              type: 'object',
              description: '响应数据',
            },
            timestamp: {
              type: 'integer',
              example: 1703145600000,
              description: '响应时间戳',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
              example: 1001,
              description: '错误码',
            },
            message: {
              type: 'string',
              example: '参数错误',
              description: '错误消息',
            },
            data: {
              type: 'object',
              nullable: true,
              description: '错误详情',
            },
            timestamp: {
              type: 'integer',
              example: 1703145600000,
              description: '响应时间戳',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1,
              description: '当前页码',
            },
            pageSize: {
              type: 'integer',
              example: 20,
              description: '每页数量',
            },
            total: {
              type: 'integer',
              example: 100,
              description: '总记录数',
            },
            totalPages: {
              type: 'integer',
              example: 5,
              description: '总页数',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: '用户ID',
            },
            openid: {
              type: 'string',
              example: 'oXXXXXXX',
              description: '微信OpenID',
            },
            nickname: {
              type: 'string',
              example: '旅行者',
              description: '用户昵称',
            },
            avatar: {
              type: 'string',
              example: 'https://example.com/avatar.png',
              description: '用户头像',
            },
            gender: {
              type: 'integer',
              enum: [0, 1, 2],
              example: 1,
              description: '性别：0-未知，1-男，2-女',
            },
            province: {
              type: 'string',
              example: '北京',
              description: '省份',
            },
            city: {
              type: 'string',
              example: '北京',
              description: '城市',
            },
            country: {
              type: 'string',
              example: '中国',
              description: '国家',
            },
            ticketCount: {
              type: 'integer',
              example: 5,
              description: '门票数量',
            },
            starCount: {
              type: 'integer',
              example: 100,
              description: '星星总数',
            },
            currentLevel: {
              type: 'integer',
              example: 5,
              description: '当前关卡',
            },
            status: {
              type: 'integer',
              enum: [0, 1, 2],
              example: 0,
              description: '状态：0-正常，1-封禁，2-已删除',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
            updateTime: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
            },
          },
        },
        Level: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: '关卡ID',
            },
            levelName: {
              type: 'string',
              example: '华北地区',
              description: '关卡名称',
            },
            levelNameEn: {
              type: 'string',
              example: 'North China',
              description: '关卡英文名',
            },
            description: {
              type: 'string',
              example: '华北地区地理知识问答',
              description: '关卡描述',
            },
            difficulty: {
              type: 'integer',
              enum: [1, 2, 3, 4],
              example: 2,
              description: '难度：1-简单，2-中等，3-困难，4-专家',
            },
            provinceId: {
              type: 'integer',
              example: 1,
              description: '关联省份ID',
            },
            questionCount: {
              type: 'integer',
              example: 10,
              description: '题目数量',
            },
            timeLimit: {
              type: 'integer',
              example: 60,
              description: '时间限制（秒）',
            },
            starReward: {
              type: 'integer',
              example: 3,
              description: '星星奖励',
            },
            sortOrder: {
              type: 'integer',
              example: 1,
              description: '排序',
            },
            status: {
              type: 'integer',
              enum: [0, 1],
              example: 1,
              description: '状态：0-锁定，1-解锁',
            },
          },
        },
        Question: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: '题目ID',
            },
            questionText: {
              type: 'string',
              example: '北京是中国的首都吗？',
              description: '题目内容',
            },
            questionType: {
              type: 'integer',
              enum: [1, 2, 3, 4, 5, 6],
              example: 1,
              description: '题目类型：1-单选，2-多选，3-判断，4-填空，5-图片选择，6-音频选择',
            },
            options: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['是', '否'],
              description: '选项列表',
            },
            correctAnswer: {
              type: 'string',
              example: '是',
              description: '正确答案',
            },
            explanation: {
              type: 'string',
              example: '北京是中华人民共和国的首都',
              description: '答案解析',
            },
            difficulty: {
              type: 'integer',
              enum: [1, 2, 3, 4],
              example: 1,
              description: '难度等级',
            },
            provinceId: {
              type: 'integer',
              example: 1,
              description: '关联省份ID',
            },
          },
        },
        ShopItem: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: '商品ID',
            },
            itemName: {
              type: 'string',
              example: '门票礼包',
              description: '商品名称',
            },
            itemType: {
              type: 'integer',
              enum: [1, 2, 3, 4, 5],
              example: 1,
              description: '商品类型：1-门票，2-提示，3-跳过，4-时间延长，5-护盾',
            },
            description: {
              type: 'string',
              example: '包含5张门票',
              description: '商品描述',
            },
            price: {
              type: 'integer',
              example: 10,
              description: '价格（星星）',
            },
            quantity: {
              type: 'integer',
              example: 5,
              description: '数量',
            },
            dailyLimit: {
              type: 'integer',
              example: 3,
              description: '每日购买限制',
            },
            status: {
              type: 'integer',
              enum: [0, 1, 2],
              example: 1,
              description: '状态：0-下架，1-上架，2-售罄',
            },
          },
        },
        Feedback: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: '反馈ID',
            },
            userId: {
              type: 'integer',
              example: 1,
              description: '用户ID',
            },
            feedbackType: {
              type: 'integer',
              enum: [1, 2, 3, 4],
              example: 1,
              description: '反馈类型：1-Bug反馈，2-建议，3-投诉，4-其他',
            },
            title: {
              type: 'string',
              example: '登录问题',
              description: '反馈标题',
            },
            content: {
              type: 'string',
              example: '无法正常登录',
              description: '反馈内容',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '图片列表',
            },
            status: {
              type: 'integer',
              enum: [0, 1, 2, 3],
              example: 0,
              description: '状态：0-待处理，1-处理中，2-已解决，3-已关闭',
            },
            reply: {
              type: 'string',
              description: '回复内容',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
          },
        },
        GameRecord: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
              description: '记录ID',
            },
            userId: {
              type: 'integer',
              example: 1,
              description: '用户ID',
            },
            levelId: {
              type: 'integer',
              example: 1,
              description: '关卡ID',
            },
            score: {
              type: 'integer',
              example: 100,
              description: '得分',
            },
            stars: {
              type: 'integer',
              example: 3,
              description: '获得星星数',
            },
            correctCount: {
              type: 'integer',
              example: 8,
              description: '正确数量',
            },
            wrongCount: {
              type: 'integer',
              example: 2,
              description: '错误数量',
            },
            accuracy: {
              type: 'number',
              example: 0.8,
              description: '正确率',
            },
            duration: {
              type: 'integer',
              example: 45,
              description: '用时（秒）',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
          },
        },
        Region: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: '区域ID',
            },
            regionName: {
              type: 'string',
              example: '亚洲',
              description: '区域名称',
            },
            regionNameEn: {
              type: 'string',
              example: 'Asia',
              description: '区域英文名',
            },
            description: {
              type: 'string',
              example: '亚洲地区',
              description: '区域描述',
            },
            sortOrder: {
              type: 'integer',
              example: 1,
              description: '排序',
            },
            status: {
              type: 'integer',
              example: 1,
              description: '状态',
            },
          },
        },
        Country: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: '国家ID',
            },
            countryName: {
              type: 'string',
              example: '中国',
              description: '国家名称',
            },
            countryNameEn: {
              type: 'string',
              example: 'China',
              description: '国家英文名',
            },
            countryCode: {
              type: 'string',
              example: 'CN',
              description: '国家代码',
            },
            flagImage: {
              type: 'string',
              description: '国旗图片',
            },
            regionId: {
              type: 'integer',
              example: 1,
              description: '所属区域ID',
            },
          },
        },
        Province: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: '省份ID',
            },
            provinceName: {
              type: 'string',
              example: '北京',
              description: '省份名称',
            },
            provinceNameEn: {
              type: 'string',
              example: 'Beijing',
              description: '省份英文名',
            },
            countryId: {
              type: 'integer',
              example: 1,
              description: '所属国家ID',
            },
          },
        },
        City: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: '城市ID',
            },
            cityName: {
              type: 'string',
              example: '北京',
              description: '城市名称',
            },
            cityNameEn: {
              type: 'string',
              example: 'Beijing',
              description: '城市英文名',
            },
            latitude: {
              type: 'number',
              example: 39.9042,
              description: '纬度',
            },
            longitude: {
              type: 'number',
              example: 116.4074,
              description: '经度',
            },
            provinceId: {
              type: 'integer',
              example: 1,
              description: '所属省份ID',
            },
          },
        },
        AdminUser: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: '管理员ID',
            },
            username: {
              type: 'string',
              example: 'admin',
              description: '用户名',
            },
            nickname: {
              type: 'string',
              example: '管理员',
              description: '昵称',
            },
            email: {
              type: 'string',
              example: 'admin@example.com',
              description: '邮箱',
            },
            phone: {
              type: 'string',
              example: '13800138000',
              description: '手机号',
            },
            roleId: {
              type: 'integer',
              example: 1,
              description: '角色ID',
            },
            status: {
              type: 'integer',
              enum: [0, 1, 2],
              example: 0,
              description: '状态：0-正常，1-禁用，2-已删除',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: '未授权',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                code: 1002,
                message: '未授权',
                data: null,
                timestamp: 1703145600000,
              },
            },
          },
        },
        ForbiddenError: {
          description: '禁止访问',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                code: 1003,
                message: '禁止访问',
                data: null,
                timestamp: 1703145600000,
              },
            },
          },
        },
        NotFoundError: {
          description: '资源不存在',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                code: 1004,
                message: '资源不存在',
                data: null,
                timestamp: 1703145600000,
              },
            },
          },
        },
        ValidationError: {
          description: '参数验证失败',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                code: 1001,
                message: '参数错误',
                data: {
                  field: 'nickname',
                  message: '昵称不能为空',
                },
                timestamp: 1703145600000,
              },
            },
          },
        },
        InternalError: {
          description: '服务器内部错误',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                code: 1006,
                message: '服务器内部错误',
                data: null,
                timestamp: 1703145600000,
              },
            },
          },
        },
      },
    },
    tags: [
      { name: '用户模块', description: '用户相关接口' },
      { name: '关卡模块', description: '关卡相关接口' },
      { name: '题目模块', description: '题目相关接口' },
      { name: '商店模块', description: '商店相关接口' },
      { name: '排行榜模块', description: '排行榜相关接口' },
      { name: '反馈模块', description: '反馈相关接口' },
      { name: '管理后台-认证', description: '管理员认证接口' },
      { name: '管理后台-用户管理', description: '用户管理接口' },
      { name: '管理后台-关卡管理', description: '关卡管理接口' },
      { name: '管理后台-区域管理', description: '区域管理接口' },
      { name: '管理后台-国家管理', description: '国家管理接口' },
      { name: '管理后台-省份管理', description: '省份管理接口' },
      { name: '管理后台-城市管理', description: '城市管理接口' },
      { name: '管理后台-题目管理', description: '题目管理接口' },
      { name: '管理后台-商店管理', description: '商店管理接口' },
      { name: '管理后台-排行榜管理', description: '排行榜管理接口' },
      { name: '管理后台-反馈管理', description: '反馈管理接口' },
      { name: '管理后台-仪表盘', description: '仪表盘统计接口' },
    ],
  },
  apis: [
    './src/controllers/**/*.ts',
    './src/routes/**/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
