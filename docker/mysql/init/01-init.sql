-- 初始化数据库脚本
-- 创建用户（如果不存在）
CREATE USER IF NOT EXISTS 'city_memory'@'%' IDENTIFIED BY 'city_memory123';
GRANT ALL PRIVILEGES ON city_memory.* TO 'city_memory'@'%';
FLUSH PRIVILEGES;

-- 使用数据库
USE city_memory;

-- 用户信息表
CREATE TABLE IF NOT EXISTS `user_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `openid` VARCHAR(64) NOT NULL COMMENT '微信openid',
  `unionid` VARCHAR(64) DEFAULT NULL COMMENT '微信unionid',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '用户昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `gender` TINYINT NOT NULL DEFAULT 0 COMMENT '性别：0未知 1男 2女',
  `province` VARCHAR(50) DEFAULT NULL COMMENT '省份',
  `city` VARCHAR(50) DEFAULT NULL COMMENT '城市',
  `country` VARCHAR(50) DEFAULT NULL COMMENT '国家',
  `ticket_count` INT NOT NULL DEFAULT 5 COMMENT '门票数量',
  `star_count` INT NOT NULL DEFAULT 0 COMMENT '星星数量',
  `current_level` INT NOT NULL DEFAULT 1 COMMENT '当前关卡',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0正常 1封禁 2删除',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

-- 用户门票记录表
CREATE TABLE IF NOT EXISTS `user_ticket` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `change_amount` INT NOT NULL COMMENT '门票变动数量',
  `balance` INT NOT NULL COMMENT '变动后余额',
  `change_type` TINYINT NOT NULL COMMENT '变动类型：1购买 2消耗 3系统赠送 4关卡奖励',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '变动说明',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户门票记录表';

-- 用户道具表
CREATE TABLE IF NOT EXISTS `user_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `item_id` INT NOT NULL COMMENT '商品ID',
  `quantity` INT NOT NULL DEFAULT 1 COMMENT '拥有数量',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_item` (`user_id`, `item_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户道具表';

-- 区域信息表
CREATE TABLE IF NOT EXISTS `region_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `region_name` VARCHAR(50) NOT NULL COMMENT '区域名称',
  `region_name_en` VARCHAR(50) DEFAULT NULL COMMENT '区域英文名',
  `region_type` TINYINT NOT NULL COMMENT '区域类型：1国家 2省份 3城市',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '区域描述',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图片',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_region_type` (`region_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='区域信息表';

-- 国家信息表
CREATE TABLE IF NOT EXISTS `country_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `region_id` INT NOT NULL COMMENT '所属区域ID',
  `country_name` VARCHAR(50) NOT NULL COMMENT '国家名称',
  `country_name_en` VARCHAR(50) DEFAULT NULL COMMENT '国家英文名',
  `country_code` VARCHAR(10) DEFAULT NULL COMMENT '国家代码',
  `flag_image` VARCHAR(255) DEFAULT NULL COMMENT '国旗图片',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '国家简介',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_region_id` (`region_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='国家信息表';

-- 省份信息表
CREATE TABLE IF NOT EXISTS `province_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `country_id` INT NOT NULL COMMENT '所属国家ID',
  `province_name` VARCHAR(50) NOT NULL COMMENT '省份名称',
  `province_name_en` VARCHAR(50) DEFAULT NULL COMMENT '省份英文名',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '省份简介',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_country_id` (`country_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='省份信息表';

-- 城市信息表
CREATE TABLE IF NOT EXISTS `city_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `province_id` INT NOT NULL COMMENT '所属省份ID',
  `city_name` VARCHAR(50) NOT NULL COMMENT '城市名称',
  `city_name_en` VARCHAR(50) DEFAULT NULL COMMENT '城市英文名',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '城市简介',
  `latitude` DECIMAL(10, 7) DEFAULT NULL COMMENT '纬度',
  `longitude` DECIMAL(10, 7) DEFAULT NULL COMMENT '经度',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_province_id` (`province_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='城市信息表';

-- 关卡信息表
CREATE TABLE IF NOT EXISTS `level_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `level_number` INT NOT NULL COMMENT '关卡编号',
  `region_id` INT NOT NULL COMMENT '区域ID（国家/省份/城市）',
  `region_type` TINYINT NOT NULL COMMENT '区域类型：1国家 2省份 3城市',
  `region_name` VARCHAR(100) NOT NULL COMMENT '区域名称',
  `difficulty` TINYINT NOT NULL DEFAULT 1 COMMENT '难度：1简单 2中等 3困难 4专家',
  `question_count` INT NOT NULL DEFAULT 10 COMMENT '题目数量',
  `star_reward` INT NOT NULL DEFAULT 3 COMMENT '星星奖励',
  `unlock_condition` VARCHAR(255) DEFAULT NULL COMMENT '解锁条件',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '关卡描述',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_level_number` (`level_number`),
  KEY `idx_region_id` (`region_id`),
  KEY `idx_difficulty` (`difficulty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关卡信息表';

-- 题库表
CREATE TABLE IF NOT EXISTS `question_bank` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `level_id` INT NOT NULL COMMENT '关卡ID',
  `question_type` TINYINT NOT NULL COMMENT '题目类型：1单选 2多选 3判断 4填空 5图片选择 6音频选择',
  `question_text` TEXT NOT NULL COMMENT '题目内容',
  `option_a` VARCHAR(255) NOT NULL COMMENT '选项A',
  `option_b` VARCHAR(255) NOT NULL COMMENT '选项B',
  `option_c` VARCHAR(255) DEFAULT NULL COMMENT '选项C',
  `option_d` VARCHAR(255) DEFAULT NULL COMMENT '选项D',
  `correct_answer` VARCHAR(10) NOT NULL COMMENT '正确答案',
  `explanation` TEXT DEFAULT NULL COMMENT '答案解析',
  `image_url` VARCHAR(255) DEFAULT NULL COMMENT '图片URL',
  `audio_url` VARCHAR(255) DEFAULT NULL COMMENT '音频URL',
  `difficulty` TINYINT NOT NULL DEFAULT 1 COMMENT '难度：1简单 2中等 3困难 4专家',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_level_id` (`level_id`),
  KEY `idx_question_type` (`question_type`),
  KEY `idx_difficulty` (`difficulty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题库表';

-- 商店商品表
CREATE TABLE IF NOT EXISTS `shop_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item_type` TINYINT NOT NULL COMMENT '商品类型：1门票 2提示 3跳过 4时间延长 5护盾',
  `item_name` VARCHAR(50) NOT NULL COMMENT '商品名称',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '商品描述',
  `price` INT NOT NULL COMMENT '价格（星星）',
  `original_price` INT DEFAULT NULL COMMENT '原价（星星）',
  `image_url` VARCHAR(255) DEFAULT NULL COMMENT '商品图片',
  `effect` VARCHAR(255) DEFAULT NULL COMMENT '效果说明',
  `stock` INT NOT NULL DEFAULT -1 COMMENT '库存：-1表示无限',
  `daily_limit` INT NOT NULL DEFAULT -1 COMMENT '每日限购：-1表示无限',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0下架 1上架 2售罄',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_item_type` (`item_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商店商品表';

-- 用户反馈表
CREATE TABLE IF NOT EXISTS `user_feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `feedback_type` TINYINT NOT NULL COMMENT '反馈类型：1Bug 2建议 3投诉 4其他',
  `title` VARCHAR(100) NOT NULL COMMENT '反馈标题',
  `content` TEXT NOT NULL COMMENT '反馈内容',
  `images` VARCHAR(500) DEFAULT NULL COMMENT '图片URLs，逗号分隔',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0待处理 1处理中 2已解决 3已关闭',
  `reply` TEXT DEFAULT NULL COMMENT '回复内容',
  `reply_time` DATETIME DEFAULT NULL COMMENT '回复时间',
  `reply_admin_id` INT DEFAULT NULL COMMENT '回复人ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户反馈表';

-- 管理员信息表
CREATE TABLE IF NOT EXISTS `admin_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `role_id` INT NOT NULL DEFAULT 2 COMMENT '角色ID',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0正常 1禁用 2删除',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员信息表';

-- 角色信息表
CREATE TABLE IF NOT EXISTS `role_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `role_code` VARCHAR(50) NOT NULL COMMENT '角色编码',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '角色描述',
  `permissions` TEXT DEFAULT NULL COMMENT '权限列表，JSON格式',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_name` (`role_name`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色信息表';

-- 管理员操作日志表
CREATE TABLE IF NOT EXISTS `admin_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `admin_id` INT NOT NULL COMMENT '管理员ID',
  `admin_name` VARCHAR(50) NOT NULL COMMENT '管理员名称',
  `action` VARCHAR(50) NOT NULL COMMENT '操作类型',
  `module` VARCHAR(50) NOT NULL COMMENT '操作模块',
  `target` VARCHAR(100) DEFAULT NULL COMMENT '操作对象',
  `detail` TEXT DEFAULT NULL COMMENT '操作详情',
  `ip` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(255) DEFAULT NULL COMMENT 'User-Agent',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员操作日志表';

-- 每日推荐表
CREATE TABLE IF NOT EXISTS `daily_recommend` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `image_url` VARCHAR(255) DEFAULT NULL COMMENT '图片URL',
  `link_url` VARCHAR(255) DEFAULT NULL COMMENT '跳转链接',
  `start_date` DATE NOT NULL COMMENT '开始日期',
  `end_date` DATE NOT NULL COMMENT '结束日期',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0草稿 1已发布 2已过期',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_date_range` (`start_date`, `end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日推荐表';

-- 插入默认角色
INSERT INTO `role_info` (`role_name`, `role_code`, `description`, `permissions`, `status`) VALUES
('超级管理员', 'super_admin', '拥有所有权限', '["*"]', 1),
('管理员', 'admin', '普通管理员', '["user:*","question:*","level:*","item:*","feedback:*","recommend:*"]', 1),
('运营', 'operator', '运营人员', '["user:read","question:read","feedback:*","recommend:*"]', 1);

-- 插入默认管理员（密码：admin123）
INSERT INTO `admin_info` (`username`, `password`, `nickname`, `role_id`, `status`) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '超级管理员', 1, 0);

-- 插入示例商品
INSERT INTO `shop_item` (`item_type`, `item_name`, `description`, `price`, `original_price`, `effect`, `stock`, `daily_limit`, `status`, `sort_order`) VALUES
(1, '门票x5', '恢复5张门票', 10, 15, 'ticket:5', -1, 3, 1, 1),
(1, '门票x10', '恢复10张门票', 18, 30, 'ticket:10', -1, 2, 1, 2),
(2, '提示卡', '显示一个正确答案', 5, NULL, 'hint:1', -1, -1, 1, 3),
(3, '跳过卡', '跳过当前题目', 8, NULL, 'skip:1', -1, -1, 1, 4),
(4, '时间延长', '延长30秒答题时间', 6, NULL, 'time:30', -1, -1, 1, 5);
