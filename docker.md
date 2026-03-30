# Docker 配置文件详解

## 一、Dockerfile 详解

### 1.1 核心作用

Dockerfile 是用于构建 Docker 镜像的文本文件，包含了一系列指令和参数，定义了如何从基础镜像创建应用镜像。在项目中采用**多阶段构建**模式，实现开发环境与生产环境的分离。

### 1.2 文件结构解析

```
┌─────────────────────────────────────────────────────────┐
│  Stage 1: builder (构建阶段)                             │
│  - 安装依赖、编译代码                                     │
│  - 生成 dist 目录                                        │
├─────────────────────────────────────────────────────────┤
│  Stage 2: production (生产环境)                          │
│  - 仅包含运行时依赖                                       │
│  - 镜像体积最小化                                         │
├─────────────────────────────────────────────────────────┤
│  Stage 3: development (开发环境)                         │
│  - 包含完整依赖和开发工具                                  │
│  - 支持热重载                                             │
└─────────────────────────────────────────────────────────┘
```

### 1.3 指令详解

#### FROM - 指定基础镜像

```dockerfile
FROM node:18-alpine AS builder
```

| 参数 | 说明 |
|------|------|
| `node:18-alpine` | 基于 Node.js 18 的 Alpine Linux 精简版镜像（约 40MB） |
| `AS builder` | 为构建阶段命名，便于后续引用 |

**常用基础镜像对比：**

| 镜像 | 大小 | 适用场景 |
|------|------|----------|
| `node:18` | ~900MB | 完整功能，适合调试 |
| `node:18-slim` | ~200MB | 精简版，适合生产 |
| `node:18-alpine` | ~40MB | 最小化，推荐生产使用 |

#### WORKDIR - 设置工作目录

```dockerfile
WORKDIR /app
```

- 自动创建目录（如不存在）
- 后续指令都在此目录下执行
- 推荐使用绝对路径

#### RUN - 执行命令

```dockerfile
RUN npm install -g pnpm@8
RUN pnpm install --frozen-lockfile
RUN pnpm run build
```

| 参数 | 说明 |
|------|------|
| `--frozen-lockfile` | 严格按照 lock 文件安装，确保依赖一致性 |
| `-g` | 全局安装 |

**最佳实践：**
- 合并多个 RUN 命令减少镜像层数
- 使用 `&&` 连接命令，减少中间层

```dockerfile
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*
```

#### COPY - 复制文件

```dockerfile
COPY package.json pnpm-lock.yaml* ./
COPY . .
```

| 参数 | 说明 |
|------|------|
| `*` | 通配符，`pnpm-lock.yaml*` 表示文件可选 |
| `.` | 目标路径为 WORKDIR |

**COPY vs ADD：**
- `COPY`: 仅复制本地文件
- `ADD`: 支持远程 URL 和自动解压 tar 文件
- 推荐优先使用 `COPY`

#### EXPOSE - 声明端口

```dockerfile
EXPOSE 3000
```

- 仅作为文档声明，不实际发布端口
- 实际端口映射在 `docker run -p` 或 docker-compose 中配置

#### CMD - 容器启动命令

```dockerfile
CMD ["pnpm", "run", "dev"]
CMD ["node", "dist/app.js"]
```

**CMD vs ENTRYPOINT：**

| 特性 | CMD | ENTRYPOINT |
|------|-----|------------|
| 可被覆盖 | 是（docker run 参数） | 否（需 --entrypoint） |
| 用途 | 默认参数 | 固定命令 |
| 组合使用 | 作为 ENTRYPOINT 参数 | 作为可执行程序 |

```dockerfile
ENTRYPOINT ["node"]
CMD ["dist/app.js"]
```

### 1.4 多阶段构建优势

```dockerfile
FROM node:18-alpine AS builder
RUN pnpm run build

FROM node:18-alpine AS production
COPY --from=builder /app/dist ./dist
```

| 优势 | 说明 |
|------|------|
| 镜像体积小 | 生产镜像不含构建工具和源码 |
| 安全性高 | 减少攻击面 |
| 构建缓存 | 各阶段独立缓存，加速构建 |

---

## 二、docker-compose.yml 详解

### 2.1 核心作用

docker-compose.yml 是 Docker Compose 的配置文件，用于定义和运行多容器 Docker 应用。通过一条命令即可启动整个应用栈的所有服务。

### 2.2 文件结构

```yaml
version: '3.8'          # Compose 文件版本

services:               # 服务定义
  mysql:               # 服务名称
    image: mysql:8.0   # 使用的镜像
    ...

volumes:               # 数据卷定义
  mysql_data:

networks:              # 网络定义
  city-memory-network:
```

### 2.3 版本说明

| 版本 | Docker Engine | 特性 |
|------|---------------|------|
| `3.8` | 19.03.0+ | 支持 configs、secrets |
| `3.7` | 18.06.0+ | 支持 init |
| `3.6` | 18.02.0+ | 支持 tmpfs |

### 2.4 服务配置详解

#### image - 指定镜像

```yaml
image: mysql:8.0
image: mongo:7
image: redis:7-alpine
```

#### build - 构建配置

```yaml
build:
  context: .                    # 构建上下文路径
  dockerfile: Dockerfile        # Dockerfile 文件名
  target: development           # 构建目标阶段
```

#### container_name - 容器名称

```yaml
container_name: city-memory-mysql
```

#### restart - 重启策略

| 值 | 说明 |
|------|------|
| `no` | 不自动重启（默认） |
| `always` | 总是重启 |
| `on-failure` | 仅失败时重启 |
| `unless-stopped` | 除非手动停止，否则总是重启 |

#### environment - 环境变量

```yaml
environment:
  MYSQL_ROOT_PASSWORD: root123456
  MYSQL_DATABASE: city_memory
  TZ: Asia/Shanghai
```

**两种写法：**

```yaml
environment:
  - MYSQL_ROOT_PASSWORD=root123456
  - MYSQL_DATABASE=city_memory
```

```yaml
environment:
  MYSQL_ROOT_PASSWORD: root123456
  MYSQL_DATABASE: city_memory
```

#### ports - 端口映射

```yaml
ports:
  - "3306:3306"      # 主机端口:容器端口
  - "3000:3000"
```

| 格式 | 说明 |
|------|------|
| `"3000:3000"` | 指定主机端口 |
| `"3000"` | 随机主机端口 |
| `"127.0.0.1:3000:3000"` | 绑定特定 IP |

#### volumes - 数据卷

```yaml
volumes:
  - mysql_data:/var/lib/mysql                    # 命名卷
  - ./docker/mysql/init:/docker-entrypoint-initdb.d  # 绑定挂载
  - ./logs:/app/logs                             # 相对路径绑定
```

| 类型 | 语法 | 说明 |
|------|------|------|
| 命名卷 | `volume_name:/container/path` | Docker 管理的持久化存储 |
| 绑定挂载 | `./host/path:/container/path` | 主机目录映射 |
| 匿名卷 | `/container/path` | 临时存储 |

#### depends_on - 服务依赖

```yaml
depends_on:
  mysql:
    condition: service_healthy
  mongodb:
    condition: service_healthy
```

| 条件 | 说明 |
|------|------|
| `service_started` | 服务启动后（默认） |
| `service_healthy` | 服务健康检查通过后 |
| `service_completed_successfully` | 服务成功完成后 |

#### healthcheck - 健康检查

```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  interval: 10s      # 检查间隔
  timeout: 5s        # 超时时间
  retries: 5         # 重试次数
  start_period: 30s  # 启动等待时间
```

#### networks - 网络配置

```yaml
networks:
  - city-memory-network

networks:
  city-memory-network:
    driver: bridge    # 网络驱动类型
```

| 驱动 | 说明 |
|------|------|
| `bridge` | 默认，单主机通信 |
| `host` | 使用主机网络 |
| `overlay` | 跨主机通信（Swarm） |
| `none` | 无网络 |

#### command - 覆盖默认命令

```yaml
command:
  - --character-set-server=utf8mb4
  - --collation-server=utf8mb4_unicode_ci
```

```yaml
command: redis-server /usr/local/etc/redis/redis.conf
```

### 2.5 项目服务架构

```
┌─────────────────────────────────────────────────────────────┐
│                    city-memory-network                       │
├─────────┬─────────┬─────────┬─────────┬─────────┬──────────┤
│  mysql  │ mongodb │  redis  │ server  │ adminer │mongo-exp │
│  :3306  │ :27017  │  :6379  │  :3000  │  :8080  │  :8081   │
└─────────┴─────────┴─────────┴─────────┴─────────┴──────────┘
     │         │         │         │
     └─────────┴─────────┴─────────┘
              数据持久化 (volumes)
```

| 服务 | 端口 | 用途 |
|------|------|------|
| mysql | 3306 | 关系型数据库，存储用户、关卡等核心数据 |
| mongodb | 27017 | 文档数据库，存储游戏记录、进度等 |
| redis | 6379 | 缓存服务，会话、排行榜等 |
| server | 3000 | Node.js 应用服务 |
| adminer | 8080 | MySQL Web 管理界面 |
| mongo-express | 8081 | MongoDB Web 管理界面 |

---

## 三、常用 Docker 命令

### 3.1 镜像管理

```bash
docker build -t city-memory-server:latest .              # 构建镜像
docker build -t city-memory-server:dev --target development .  # 构建指定阶段

docker images                                           # 列出本地镜像
docker images | grep city-memory                        # 过滤镜像

docker rmi city-memory-server:latest                    # 删除镜像
docker rmi -f $(docker images -q)                       # 强制删除所有镜像

docker tag city-memory-server:latest city-memory:v1.0   # 标记镜像

docker save -o server.tar city-memory-server:latest     # 导出镜像
docker load -i server.tar                               # 导入镜像

docker image prune                                      # 清理悬空镜像
docker image prune -a                                   # 清理所有未使用镜像
```

### 3.2 容器管理

```bash
docker ps                                               # 列出运行中的容器
docker ps -a                                            # 列出所有容器
docker ps -q                                            # 仅显示容器 ID

docker start city-memory-mysql                          # 启动容器
docker stop city-memory-mysql                           # 停止容器
docker restart city-memory-mysql                        # 重启容器
docker kill city-memory-mysql                           # 强制停止容器

docker rm city-memory-mysql                             # 删除已停止容器
docker rm -f city-memory-mysql                          # 强制删除容器
docker rm -f $(docker ps -aq)                           # 删除所有容器

docker inspect city-memory-mysql                        # 查看容器详情
docker stats                                            # 实时资源使用统计
docker top city-memory-mysql                            # 查看容器进程

docker rename old_name new_name                         # 重命名容器
docker update --restart=always city-memory-mysql        # 更新容器配置
```

### 3.3 容器操作

```bash
docker logs city-memory-server                          # 查看日志
docker logs -f city-memory-server                       # 实时跟踪日志
docker logs --tail 100 city-memory-server               # 最后 100 行
docker logs --since 2h city-memory-server               # 最近 2 小时

docker exec -it city-memory-mysql bash                  # 进入容器终端
docker exec -it city-memory-mysql mysql -uroot -p       # 执行命令

docker cp ./file.txt city-memory-server:/app/           # 复制文件到容器
docker cp city-memory-server:/app/logs ./               # 从容器复制文件

docker commit city-memory-server my-image:v1            # 创建镜像快照
docker diff city-memory-server                          # 查看文件变更
```

### 3.4 Docker Compose 命令

```bash
docker compose up                                       # 启动所有服务
docker compose up -d                                    # 后台启动
docker compose up --build                               # 重新构建后启动
docker compose up -d mysql redis                        # 仅启动指定服务

docker compose down                                     # 停止并删除容器
docker compose down -v                                  # 同时删除数据卷
docker compose down --rmi all                           # 同时删除镜像

docker compose start                                    # 启动已存在的容器
docker compose stop                                     # 停止容器
docker compose restart                                  # 重启容器
docker compose pause                                    # 暂停容器
docker compose unpause                                  # 恢复容器

docker compose ps                                       # 查看服务状态
docker compose logs                                     # 查看所有服务日志
docker compose logs -f server                           # 实时跟踪指定服务日志

docker compose exec mysql bash                          # 进入服务容器
docker compose run --rm server pnpm test                # 运行一次性命令

docker compose build                                    # 构建服务镜像
docker compose pull                                     # 拉取服务镜像
docker compose push                                     # 推送服务镜像

docker compose config                                   # 验证配置文件
docker compose config --services                        # 列出所有服务
docker compose images                                   # 列出服务使用的镜像

docker compose top                                      # 查看服务进程
docker compose port server 3000                         # 查看端口映射
```

### 3.5 数据卷管理

```bash
docker volume ls                                        # 列出所有数据卷
docker volume inspect city-memory_mysql_data            # 查看数据卷详情
docker volume create my_volume                          # 创建数据卷
docker volume rm my_volume                              # 删除数据卷
docker volume prune                                     # 清理未使用的数据卷
```

### 3.6 网络管理

```bash
docker network ls                                       # 列出所有网络
docker network inspect city-memory-network              # 查看网络详情
docker network create my_network                        # 创建网络
docker network rm my_network                            # 删除网络
docker network prune                                    # 清理未使用的网络

docker network connect my_network my_container          # 连接容器到网络
docker network disconnect my_network my_container       # 断开容器网络
```

### 3.7 系统管理

```bash
docker info                                             # 查看 Docker 系统信息
docker version                                          # 查看 Docker 版本
docker df                                               # 查看磁盘使用情况
docker df -v                                            # 详细磁盘使用

docker system prune                                     # 清理未使用资源
docker system prune -a                                  # 清理所有未使用资源
docker system prune -a --volumes                        # 包括数据卷

docker system events                                    # 实时事件流
docker system info                                      # 系统信息
```

### 3.8 项目常用命令组合

```bash
docker compose up -d mysql mongodb redis && docker compose logs -f server

docker compose down -v && docker compose up --build -d

docker compose exec mysql mysql -uroot -proot123456 city_memory

docker compose exec mongodb mongosh -u admin -p admin123456 --authenticationDatabase admin

docker compose exec redis redis-cli

docker cp ./backup/city_memory.sql city-memory-mysql:/tmp/ && docker compose exec mysql mysql -uroot -proot123456 city_memory < /tmp/city_memory.sql

docker compose exec server pnpm run migrate
```

---

## 四、最佳实践

### 4.1 Dockerfile 最佳实践

1. **使用 .dockerignore 排除无关文件**
```
node_modules
dist
logs
.git
*.md
.env*
```

2. **合理利用构建缓存**
```dockerfile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
```

3. **最小化镜像层数**
```dockerfile
RUN apt-get update \
    && apt-get install -y curl vim \
    && rm -rf /var/lib/apt/lists/*
```

4. **使用特定版本标签**
```dockerfile
FROM node:18.19.0-alpine3.19
```

### 4.2 docker compose 最佳实践

1. **使用环境变量文件**
```yaml
env_file:
  - .env.development
```

2. **健康检查确保服务就绪**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

3. **资源限制**
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

4. **日志配置**
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

---

## 五、故障排查

### 5.1 常见问题

| 问题 | 排查命令 | 解决方案 |
|------|----------|----------|
| 容器无法启动 | `docker logs container_name` | 检查日志错误信息 |
| 端口冲突 | `lsof -i :3000` | 更改端口映射 |
| 磁盘空间不足 | `docker system df` | 清理未使用资源 |
| 网络连接失败 | `docker network inspect` | 检查网络配置 |
| 权限问题 | `docker exec -u 0 container` | 以 root 用户执行 |

### 5.2 调试命令

```bash
docker compose config              # 验证配置语法
docker compose logs --tail=200     # 查看详细日志
docker inspect --format='{{.State.Status}}' container  # 检查容器状态
docker exec container env          # 查看环境变量
docker network inspect bridge      # 检查网络配置
```
