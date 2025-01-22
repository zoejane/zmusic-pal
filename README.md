# zMusic-Pal | 音乐伙伴

A lightweight and elegant web application for quick key and chord lookup, featuring an AI companion for deeper musical exploration.  
一个小巧优雅的 Web 应用，用于快速查找调性和和弦，同时配备 AI 伙伴，提供更深入的音乐陪伴。

[zMusic-Pal](https://zmusic-pal.zoejane.net)  


## Core Features | 核心功能

### 1. Key Finder | 查调
Enter a key (e.g., F major) to view:  
输入调性（如 F 大调），查看：

**Scale | 音阶:**  
F G A Bb C D E

**Common Triads | 常用三和弦:**
```
I     F      F - A - C
ii    Gm     G - Bb - D
iii   Am     A - C - E
IV    Bb     Bb - D - F
V     C      C - E - G
vi    Dm     D - F - A
```

### 2. Chord Finder | 查和弦
Select a chord (e.g., Am) to see its component notes (e.g., A - C - E).  
选择和弦（如 Am），查看组成音（如 A - C - E）。

### 3. AI Pal | AI 伙伴
Ask any music-related questions, and AI Pal will provide creative support and practical advice. For example:  
提出任何音乐相关问题，AI Pal 将提供创意支持和实用建议。例如：
- "What are common chord progressions in rock music?" | "摇滚中常见的和弦进程是什么？"
- "How to reharmonize a pop song?" | "如何为一首流行歌曲重新配和弦？"

### 4. Mobile-Friendly | 移动端友好
Access and use on mobile devices for music exploration anytime, anywhere.  
支持移动设备访问和使用，随时随地进行音乐探索。

## Quick Start | 快速开始

### Website | 在线体验
Visit directly: [zMusic-Pal](https://zmusic-pal.zoejane.net)  
直接访问：[zMusic-Pal 在线体验](https://zmusic-pal.zoejane.net)

### Local Development | 本地运行（可选）

1. Clone the repository | 克隆项目：
```bash
git clone https://github.com/zoejane/zmusic-pal.git
cd zmusic-pal
```

2. Install dependencies | 安装依赖：
```bash
npm install
```

3. Start the development server | 启动项目：
```bash
npm run dev
```

4. Open in browser | 打开浏览器访问：http://localhost:3000

## Tech Stack | 技术架构
- Frontend | 前端：Next.js + React + TypeScript + Tailwind CSS
- Backend | 后端：FastAPI + Python
- AI Integration | AI 集成：Deepseek API

## License | 许可证
MIT © 2025 ZoeJane

## About | 关于
zMusic-Pal is a compact and efficient music tool designed for creators.  
zMusic-Pal 是一个小巧而高效的音乐工具，专为创作者设计。

Whether you're composing, practicing, or exploring music theory, it provides inspiration and support.  
无论是作曲、练习还是探索音乐理论，它都能为您提供灵感和支持。

Experience zMusic-Pal and embark on a wonderful musical journey together!  
体验 zMusic-Pal，一起开启音乐的美好旅程！


## Changelog

- 20250121 zoejane add English version
- 20250117 zoejane init
