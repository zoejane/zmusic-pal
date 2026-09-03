# zMusic-Pal | 音乐伙伴

*English | [简体中文](#简体中文)*

A lightweight, mobile-friendly site for quick **key** and **chord** lookup. The useful core runs entirely in the browser — no Python server, no Zeabur.

[zMusic-Pal](https://zmusic-pal.zoejane.net)

## What runs where

| Feature | How it works |
| --- | --- |
| **Key Finder / 查调** | Client-side only. Works on GitHub Pages and offline. |
| **Chord Finder / 查和弦** | Client-side only. Works on GitHub Pages and offline. |
| **AI Pal / AI 伙伴** | Optional. Needs a FastAPI backend (Deepseek keys stay on the server). **Off** on this static Pages build. |
| FastAPI (`backend/`) | **Not required** to use the site. **Do not deploy FastAPI to GitHub Pages** — Pages only serves static files. |

Do not put Deepseek or other API keys in the frontend. `.env.production` is a public frontend env file (no secrets). It used to point `NEXT_PUBLIC_API_URL` at a Zeabur FastAPI host; that is no longer used.

## Host on GitHub Pages

This is a Next.js **static export** (`output: "export"` → `out/`).

1. Merge to `main`. GitHub Actions (`.github/workflows/pages.yml`) builds the static site and deploys it.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Custom domain (already in `public/CNAME`): `zmusic-pal.zoejane.net`.

**DNS** (when you are ready to point the name): add a CNAME record

```
zmusic-pal.zoejane.net  →  zoejane.github.io
```

Then in Pages settings confirm the custom domain and enable HTTPS. Until DNS is pointed, you can still use the `*.github.io` URL GitHub shows after the first deploy.

If you need the project URL `https://<user>.github.io/zmusic-pal/` **without** a custom domain, rebuild with `NEXT_PUBLIC_BASE_PATH=/zmusic-pal` (asset paths must include the repo name). With the custom domain, leave `basePath` empty (site is served from `/`).

Local static preview (no FastAPI):

```bash
npm install
npm run test:music    # Key / chord lookup, no server
npm run build         # writes ./out
npm start             # serves ./out
```

## Core Features

### 1. Key Finder
Enter a key (e.g., F major) to view:

**Scale:**  
F G A Bb C D E

**Common Triads:**
```
I     F      F - A - C
ii    Gm     G - Bb - D
iii   Am     A - C - E
IV    Bb     Bb - D - F
V     C      C - E - G
vi    Dm     D - F - A
```

### 2. Chord Finder
Select a chord (e.g., Am) to see its component notes (e.g., A - C - E).

### 3. AI Pal (optional, currently off)
Ask music-related questions. This needs a server; the static Pages site shows a short note instead of chat. See `backend/README.md` if you run FastAPI locally.

### 4. Mobile-Friendly
Works on phones and desktops.

## Local Development

```bash
git clone https://github.com/zoejane/zmusic-pal.git
cd zmusic-pal
npm install
npm run dev
```

Open http://localhost:3000 — 查调 and 查和弦 work with **no** backend.

## Tech Stack
- Frontend: Next.js (static export) + React + TypeScript + Tailwind CSS
- Optional backend: FastAPI + Python (AI Pal only)
- Optional AI: Deepseek API (server-side only)

## License
MIT © 2025 ZoeJane

## About
zMusic-Pal is a compact music tool for composers and learners. Look up keys and chords anywhere; AI Pal stays optional.

---

# 简体中文

*[English](#zmusic-pal--音乐伙伴) | 简体中文*

小巧、适合手机的网页：**查调**和**查和弦**全部在浏览器里完成，不需要 Python，也不需要 Zeabur。

[zMusic-Pal](https://zmusic-pal.zoejane.net)

## 功能怎么跑

| 功能 | 说明 |
| --- | --- |
| **查调** | 纯前端。可放在 GitHub Pages，也可离线用。 |
| **查和弦** | 纯前端。可放在 GitHub Pages，也可离线用。 |
| **AI 伙伴** | 可选。需要 FastAPI 后端（Deepseek 密钥只放服务器）。**当前静态站点已关闭。** |
| FastAPI（`backend/`） | **不是**使用本站的前提。**不要把 FastAPI 部署到 GitHub Pages**（Pages 只能托管静态文件）。 |

不要把 Deepseek 等密钥写进前端。仓库里的 `.env.production` 是公开的前端环境变量（不含密钥）；以前曾把 `NEXT_PUBLIC_API_URL` 指向 Zeabur 上的 FastAPI，现已不再调用。

## 发布到 GitHub Pages

本仓库使用 Next.js **静态导出**（`output: "export"`，产物在 `out/`）。

1. 合并到 `main`。GitHub Actions（`.github/workflows/pages.yml`）会构建并发布。
2. 仓库 **Settings → Pages → Build and deployment → Source: GitHub Actions**。
3. 自定义域名已写入 `public/CNAME`：`zmusic-pal.zoejane.net`。

**DNS**（准备好再指过去）：添加 CNAME

```
zmusic-pal.zoejane.net  →  zoejane.github.io
```

然后在 Pages 设置里确认自定义域名并打开 HTTPS。DNS 未指向前，仍可用 GitHub 提供的 `*.github.io` 地址。

若要用 `https://<user>.github.io/zmusic-pal/` **且没有**自定义域名，构建时设置 `NEXT_PUBLIC_BASE_PATH=/zmusic-pal`。使用自定义域名时保持 `basePath` 为空（站点挂在根路径）。

本地预览静态站（不启动 FastAPI）：

```bash
npm install
npm run test:music    # 查调 / 查和弦，无后端
npm run build         # 生成 ./out
npm start             # 托管 ./out
```

## 核心功能

### 1. 查调
输入调性（如 F 大调），查看音阶和常用三和弦（见英文示例）。

### 2. 查和弦
选择和弦（如 Am），查看组成音（如 A - C - E）。

### 3. AI 伙伴（可选，当前关闭）
需要服务器。静态 Pages 上只显示简短说明。若要本地跑 FastAPI，见 `backend/README.md`。

### 4. 移动端友好
手机和桌面都可使用。

## 本地运行

```bash
git clone https://github.com/zoejane/zmusic-pal.git
cd zmusic-pal
npm install
npm run dev
```

打开 http://localhost:3000 — **查调 / 查和弦不需要后端**。

## 技术架构
- 前端：Next.js 静态导出 + React + TypeScript + Tailwind CSS
- 可选后端：FastAPI + Python（仅 AI 伙伴）
- 可选 AI：Deepseek API（仅服务端）

## 许可证
MIT © 2025 ZoeJane

## 更新日志

- 20260903 静态站点：查调 / 查和弦纯前端；GitHub Pages；AI 伙伴无后端时关闭
- 20250121 zoejane 添加英文版本
- 20250117 zoejane 初始化项目
