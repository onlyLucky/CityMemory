# 静态资源目录

## 目录结构

```
static/
├── images/          # 图片资源
│   ├── logo.png     # 品牌Logo
│   ├── default-avatar.png  # 默认头像
│   └── flags/       # 国旗图片
├── icons/           # 图标资源
│   └── tabbar/      # TabBar图标
└── audio/           # 音效资源
    ├── correct.mp3  # 正确音效
    ├── wrong.mp3    # 错误音效
    └── success.mp3  # 成功音效
```

## 资源说明

### 图片资源
- logo.png: 品牌Logo，建议尺寸 200x200px
- default-avatar.png: 默认用户头像，建议尺寸 100x100px
- flags/: 国旗图片目录，命名格式为国家英文名小写.png

### 图标资源
- tabbar/: TabBar图标，建议尺寸 28x28px
  - home.png / home-active.png
  - rank.png / rank-active.png
  - profile.png / profile-active.png

### 音效资源
- correct.mp3: 答对音效，时长约0.5s
- wrong.mp3: 答错音效，时长约0.5s
- success.mp3: 成功音效，时长约1s
