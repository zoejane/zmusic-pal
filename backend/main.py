from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.options("/api/chat")
async def options_chat():
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "https://zmusic-pal-web.vercel.app",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """处理聊天请求"""
    try:
        response_text = await get_ai_response(message.content)
        response = JSONResponse(content={"response": response_text})
        response.headers["Access-Control-Allow-Origin"] = "https://zmusic-pal-web.vercel.app"
        return response
    except Exception as e:
        error_response = JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        )
        error_response.headers["Access-Control-Allow-Origin"] = "https://zmusic-pal-web.vercel.app"
        return error_response

class ChatMessage(BaseModel):
    content: str

class ChatResponse(BaseModel):
    response: str

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

async def get_ai_response(message: str) -> str:
    """调用 Deepseek API 获取回答"""
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "system",
                "content": """你扮演音乐伙伴的角色，精通音乐理论和作曲。你会：
                1. 用简洁专业的语言回答问题
                2. 给出具体的建议和例子
                3. 涉及和弦时会同时给出和弦符号和具体音符
                4. 优先使用中文回答，除非用户用其他语言提问"""
            },
            {
                "role": "user",
                "content": message
            }
        ],
        "temperature": 0.7,
        "max_tokens": 1000
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(DEEPSEEK_API_URL, json=data, headers=headers)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 