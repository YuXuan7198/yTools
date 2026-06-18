# 🧰 yTools

开发者常用编码工具聚合 — 一个简洁优雅的单页 Web 应用。

## ✨ 功能

| 工具 | 说明 |
|------|------|
| 🔗 URL 编解码 | `encodeURIComponent` / `decodeURIComponent` |
| 📋 JSON 格式化 | 展开（pretty-print）与压缩（minify），含语法校验 |
| 🔐 Base64 编解码 | `btoa` / `atob`，完整支持 UTF-8 |
| 🕐 时间戳转换 | Unix 时间戳 ↔ 可读日期时间，自动识别秒/毫秒 |
| 🔤 Unicode 转换 | 字符 ↔ `\uXXXX` 转义序列 |
| 🔒 SHA 哈希 | SHA-1 / SHA-256 / SHA-512（Web Crypto API） |
| 🔍 正则测试 | 输入正则 + flags + 测试文本，高亮所有匹配 |

## 🎨 设计

- 柔和暖色调：米白底色 + 琥珀金强调
- 左侧侧边栏（带搜索），右侧输入/输出双栏实时转换
- 150ms 淡入淡出动效

## 🛠 技术栈

- **Vue 3**（Composition API，`<script setup>`）
- **Vite 5** 构建
- **Vitest** 单元测试（31 个用例）
- **零后端** — 所有计算在浏览器端完成（Web Crypto、TextEncoder、btoa 等）

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 运行测试
npm test

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 📁 项目结构

```
src/
├── main.js              # Vue 入口
├── App.vue              # 根布局
├── components/
│   ├── Sidebar.vue      # 侧边栏 + 搜索
│   └── ToolPanel.vue    # 工具面板（7 合 1）
└── utils/
    └── tools.js         # 纯函数（所有编解码逻辑）
```

## 📄 License

MIT
