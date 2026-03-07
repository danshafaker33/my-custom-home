# My Custom Home / 个人主页

[English](#english) | [中文](#chinese)

<a name="english"></a>
## English

### Introduction
A highly customizable, responsive personal homepage built with **Vue 3**, **Vuetify**, and **Vite**. This project is a refactored version inspired by `leleo-home-page`, featuring enhanced architecture, internationalization (i18n), and modern UI components.

### Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile.
- **Internationalization**: Full support for English and Chinese (`zh-CN`).
- **Custom Components**:
  - **Profile Card**: With typewriter effect.
  - **Project Grid**: With 3D hover effects.
  - **Config Panel**: Real-time theme and language switching.
- **Modern Tech Stack**: Vue 3 (Composition API), Vite, Vuetify 3.

### Installation
```bash
npm install
npm run dev
npm run build
```

---

<a name="chinese"></a>
## 中文

### 简介
这是一个基于 **Vue 3**、**Vuetify** 和 **Vite** 构建的高可定制、响应式个人主页项目。它参考了 `leleo-home-page`，并在架构、国际化和界面组件上做了现代化重构。

### 功能特性
- **响应式设计**：适配桌面、平板和手机。
- **国际化支持**：内置中英文切换（`zh-CN` / `en-US`）。
- **自定义组件**：
  - **个人卡片**：带打字机效果。
  - **项目展示**：带 3D 悬停效果。
  - **设置面板**：支持实时切换语言和音乐配置。
- **现代前端栈**：Vue 3（Composition API）、Vite、Vuetify 3。

### 安装与运行
```bash
npm install
npm run dev
npm run build
```

### 目录结构
```text
src/
  components/   # Vue 组件
  locales/      # i18n 语言文件
  plugins/      # Vuetify / i18n 插件
  store/        # 全局状态
  App.vue       # 主布局
  main.js       # 入口文件
  data.js       # 静态数据
```

### 音乐配置
你可以通过两种方式添加音乐：

1. 通过界面：打开右下角设置面板，进入“音乐播放”，然后点击“添加音乐”。
2. 通过代码：编辑 `src/data.js` 中的 `initialPlaylist` 数组。

本地资源约定：
- 音频文件放在 `public/music/` 下，并使用 `/music/文件名.mp3`。
- 封面图片放在 `public/covers/` 下，并使用 `/covers/文件名.jpg`。
