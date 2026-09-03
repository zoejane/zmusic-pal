# backend/ (optional leftover)

This FastAPI app is **not** what GitHub Pages serves. The public site is `docs/` (vanilla HTML/JS).

查调 / 查和弦 do not use this server. **Do not deploy FastAPI to GitHub Pages.**

AI Pal (Deepseek) lived here. API keys stay in this folder only — never in `docs/`.

## Local (optional)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set DEEPSEEK_API_KEY
uvicorn main:app --reload --port 8000
```

Then in the frontend `.env.local`:

```
NEXT_PUBLIC_ENABLE_AI_PAL=true
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run `npm run dev` (or a static preview after `npm run build` will still have AI Pal compiled off unless you set those variables at **build** time).
