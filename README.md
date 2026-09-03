# zMusic-Pal | 音乐伙伴

*English | [简体中文](#简体中文)*

A tiny, mobile-friendly **static** page for key and chord lookup. Scales and chords are **computed in the browser** (plain JavaScript). No FastAPI, no Deepseek, no API keys, no extra host.

Live (custom domain, after DNS): [https://zmusic-pal.zoejane.net](https://zmusic-pal.zoejane.net)

## What GitHub Pages serves

The public site is the vanilla page in **`docs/`** (`index.html` + CSS + JS). That is the skin. The music is an algorithm in `docs/music.js`, not a database.

| Feature | On GitHub Pages |
| --- | --- |
| Key Finder / 查调 | Yes — client-side |
| Chord Finder / 查和弦 | Yes — client-side |
| AI Pal / AI 伙伴 | **Not on this static version** (one-line note only) |

The Next.js app and `backend/` FastAPI tree are **kept in git** as the old project. They are **not** required to use or deploy the site. **Do not deploy FastAPI to GitHub Pages** (Pages only serves files).

`.env.production` in the repo is a public frontend env file (no secrets). It used to point `NEXT_PUBLIC_API_URL` at a Zeabur FastAPI host; the Pages site does not call it.

## Enable GitHub Pages (no build)

Simplest: publish the `/docs` folder from the default branch.

1. Merge this to `main`.
2. Repo **Settings → Pages**.
3. **Build and deployment → Source:** Deploy from a branch.
4. **Branch:** `main`, **folder:** `/docs`. Save.

GitHub will use `docs/CNAME` (`zmusic-pal.zoejane.net`). Until DNS is pointed, use the `https://zoejane.github.io/zmusic-pal/` URL GitHub shows.

**DNS** when ready:

```
zmusic-pal.zoejane.net  CNAME  zoejane.github.io
```

Then confirm the custom domain in Pages settings and enable HTTPS.

There is no Next.js export and no npm step for hosting. Optional check: `node docs/verify.cjs`.

Open locally:

```bash
# any static server, e.g.
python3 -m http.server 4173 --directory docs
```

Then http://localhost:4173/

## Core features

### Key Finder / 查调
Example — F major: `F G A Bb C D E` and triads I F, ii Gm, iii Am, IV Bb, V C, vi Dm.

### Chord Finder / 查和弦
Example — Am: `A - C - E`.

## Old Next.js + FastAPI (optional, not for Pages)

`npm install && npm run dev` still runs the leftover Next app. `backend/` is the old AI Pal server (Deepseek keys belong only there, never in `docs/`). See `backend/README.md`.

## License
MIT © 2025 ZoeJane

---

# 简体中文

*[English](#zmusic-pal--音乐伙伴) | 简体中文*

小巧、适合手机的**静态页**：查调和查和弦都在浏览器里用算法算出来。没有 FastAPI、没有 Deepseek、没有密钥、也不需要再开一台主机。

线上（DNS 指好后）：[https://zmusic-pal.zoejane.net](https://zmusic-pal.zoejane.net)

## GitHub Pages 发布的是什么

公开站点就是 **`docs/`** 里的 HTML/CSS/JS。乐理在 `docs/music.js` 里计算，不是数据库。

| 功能 | GitHub Pages |
| --- | --- |
| 查调 | 有，纯前端 |
| 查和弦 | 有，纯前端 |
| AI 伙伴 | **静态版不含**（只留一行说明） |

仓库里仍保留原来的 Next.js 和 `backend/`，方便对照历史。**用站、上线都不需要它们。不要把 FastAPI 部署到 Pages。**

仓库里的 `.env.production` 是公开前端变量（没有密钥），以前指向 Zeabur 上的 FastAPI；Pages 站点不会去请求它。

## 打开 GitHub Pages（不用构建）

最简单：用默认分支的 `/docs` 目录。

1. 合并到 `main`。
2. 仓库 **Settings → Pages**。
3. **Source：** Deploy from a branch。
4. **Branch：** `main`，**folder：** `/docs`。保存。

`docs/CNAME` 已写成 `zmusic-pal.zoejane.net`。DNS 未指向前，可用 GitHub 给出的 `https://zoejane.github.io/zmusic-pal/`。

**DNS：**

```
zmusic-pal.zoejane.net  CNAME  zoejane.github.io
```

然后在 Pages 里确认自定义域名并打开 HTTPS。

托管不需要 Next 导出，也不需要 npm。本地检查：`node docs/verify.cjs`。

```bash
python3 -m http.server 4173 --directory docs
```

打开 http://localhost:4173/

## 更新日志

- 20260903 GitHub Pages 改为 `docs/` 纯静态页；查调 / 查和弦在浏览器计算；AI 伙伴不在静态版
- 20250121 zoejane 添加英文版本
- 20250117 zoejane 初始化项目
