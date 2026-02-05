# My Custom Home / 个人主页

[English](#english) | [中文](#chinese)

<a name="english"></a>
## English

### Introduction
A highly customizable, responsive personal homepage built with **Vue 3**, **Vuetify**, and **Vite**. This project is a refactored version inspired by `leleo-home-page`, featuring enhanced architecture, internationalization (i18n), and modern UI components.

### Features
- **Responsive Design**: Optimized for Desktop, Tablet, and Mobile.
- **Internationalization**: Full support for English and Chinese (zh-CN).
- **Custom Components**:
  - **Profile Card**: With typewriter effect.
  - **Project Grid**: With 3D hover effects.
  - **Config Panel**: Real-time theme and language switching.
- **Modern Tech Stack**: Vue 3 (Composition API), Vite, Vuetify 3.

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

<a name="chinese"></a>
## 中文

### 简介
一个基于 **Vue 3**、**Vuetify** 和 **Vite** 构建的高度可定制、响应式个人主页。本项目受 `leleo-home-page` 启发并在其基础上进行了深度重构，增强了架构设计，支持国际化 (i18n)，并引入了现代化的 UI 组件。

### 功能特性
- **响应式设计**: 完美适配桌面、平板和手机端。
- **国际化支持**: 内置中英文切换 (zh-CN / en-US)。
- **定制组件**:
  - **个人卡片**: 集成打字机动态效果。
  - **项目展示**: 具有 3D 悬停倾斜特效。
  - **配置面板**: 支持实时切换主题和语言。
- **现代技术栈**: Vue 3 (组合式 API), Vite, Vuetify 3。

### 安装与运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打包构建
npm run build
```

### 目录结构 / Directory Structure
```
src/
  ├── components/      # Vue Components (组件)
  ├── locales/         # i18n JSON files (语言包)
  ├── plugins/         # Vue plugins (Vuetify, i18n)
  ├── store/           # Global state (音乐播放管理等)
  ├── App.vue          # Main Layout (主布局)
  ├── main.js          # Entry point (入口文件)
  └── data.js          # Static Data (音乐列表、个人信息配置)
```

### 音乐配置说明 / Music Configuration
#### English
You can add your music in two ways:
1.  **Via UI**: Open "Settings" (gear icon) -> "Music" -> "Add Music".
2.  **Via Code**: Edit `src/data.js` and update the `initialPlaylist` array.
    *   Place local MP3 files in `public/music/` and use `/music/your-file.mp3`.
    *   Place local cover images in `public/covers/` and use `/covers/your-image.jpg`.

#### 中文
你可以通过以下两种方式添加音乐：
1.  **通过界面**: 点击右下角“设置”（齿轮图标） -> “音乐播放” -> “添加音乐”。
2.  **通过代码**: 编辑 `src/data.js` 文件，修改 `initialPlaylist` 数组。
    *   将本地 MP3 文件放入 `public/music/` 文件夹，链接填入 `/music/文件名.mp3`。
    *   将本地封面图片放入 `public/covers/` 文件夹，链接填入 `/covers/文件名.jpg`。
