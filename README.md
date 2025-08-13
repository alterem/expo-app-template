# Expo App Template

一个基于 Expo 和 React Native 的移动应用模板，现代移动应用开发的最佳实践。

## 功能特性

- 🎯 **一言展示** - 每日精选句子，支持刷新获取新内容
- 🎨 **样式演示** - 完整的 UI 组件库，包含按钮、卡片、表单等
- 👤 **个人中心** - 用户信息管理和设置页面
- 🌈 **现代配色** - 清新的绿色主题设计

## 技术栈

- **Expo** - 跨平台开发框架
- **React Native** - 移动应用开发
- **TypeScript** - 类型安全的 JavaScript
- **React Navigation** - 导航管理
- **Expo Vector Icons** - 图标库

## 应用截图

### 首页 - 一言展示
![首页截图](docs/home-screen.png)

### 样式演示页面
![样式页面截图](docs/style-screen.png)

### 个人中心
![个人中心截图](docs/profile-screen.png)

![启动相机](docs/launch-camera.png)

### 所有组件

![所有组件](docs/ALL.JPEG)

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm start
```

### 在设备上运行

- **iOS**: 按 `i` 或使用 Expo Go 扫描二维码
- **Android**: 按 `a` 或使用 Expo Go 扫描二维码

## 项目结构

```
├── src/
│   ├── screens/          # 页面组件
│   │   ├── HomeScreen.tsx
│   │   ├── StyleScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── types/            # TypeScript 类型定义
├── assets/               # 静态资源
├── App.tsx              # 应用入口
└── package.json         # 项目配置
```

## 主要页面

- **首页**: 展示每日一言，支持下拉刷新
- **样式页面**: UI 组件演示，包含拖拽交互功能
- **个人中心**: 用户信息和应用设置

## 应用打包

### 方法一：EAS Build（推荐）

EAS Build 是 Expo 的现代化云端构建服务，支持自动化构建和分发。

#### 1. 安装和配置
```bash
# 安装 EAS CLI
npm install --global eas-cli
```

登陆(参考官网：https://expo.dev/)
```bash
eas init --id [BUILD_ID]
```


#### 2. 构建应用
```bash
# 构建 Android APK（测试版）
eas build --platform android --profile preview

# 构建生产版本
eas build --platform android --profile production
eas build --platform ios --profile production

# 同时构建两个平台
eas build --platform all --profile production
```

#### 3. 查看构建状态
```bash
# 查看构建列表
eas build:list

# 查看构建详情
eas build:view [BUILD_ID]
```

### 方法二：本地构建

适合需要完全控制构建过程的开发者。

#### 1. 预构建项目
```bash
npx expo prebuild
```

#### 2. 平台构建
```bash
# Android 构建（需要 Android Studio）
npx expo run:android --variant release

# iOS 构建（仅限 macOS，需要 Xcode）
npx expo run:ios --configuration Release

# Web 版本
npx expo export:web
```

### 构建配置

确保 `app.json` 包含必要信息：

```json
{
  "expo": {
    "name": "HitokotoApp",
    "slug": "hitokoto-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourname.hitokotoapp"
    },
    "android": {
      "package": "com.yourname.hitokotoapp"
    }
  }
}
```

### 注意事项

- **免费限制**: Expo 免费账户每月有构建次数限制
- **构建时间**: 云端构建通常需要 5-15 分钟
- **测试优先**: 建议先构建 `preview` 版本进行测试

## 开发说明

本项目使用现代化的开发工具和最佳实践：

- TypeScript 提供类型安全
- 组件化架构便于维护
- 响应式设计适配不同屏幕
- 清新的绿色主题设计

## 许可证

[MIT License](LICENSE)

## 赞赏我

![赞赏码](./docs/reward-code.jpg)

*"一杯咖啡，一声鼓励。"*