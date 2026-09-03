# backend/ (optional)

This FastAPI app is **not required** to use 查调 (Key Finder) or 查和弦 (Chord Finder). Those run entirely in the browser.

GitHub Pages cannot run Python. Do **not** deploy this folder to Pages.

AI Pal uses this server to call Deepseek (or Zhipu). API keys stay here — never in the Next.js frontend.

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
