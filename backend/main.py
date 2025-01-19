from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
import os
import logging
from dotenv import load_dotenv

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://zmusic-pal-web.vercel.app",
        "https://zmusic-pal.zeabur.app",
        "https://v0.dev",
        "https://*.v0.dev"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    content: str

class ChatResponse(BaseModel):
    response: str

@app.post("/api/chat")
async def chat(message: ChatMessage):
    """处理聊天请求"""
    try:
        logger.info(f"收到聊天请求: {message.content}")
        response_text = await get_ai_response(message.content)
        logger.info(f"返回响应: {response_text}")
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error(f"处理聊天请求时出错: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

async def get_ai_response(message: str) -> str:
    """调用 Deepseek API 获取回答"""
    if not DEEPSEEK_API_KEY:
        logger.error("DEEPSEEK_API_KEY 未设置")
        raise ValueError("DEEPSEEK_API_KEY is not set")
        
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
        logger.info("正在调用 Deepseek API")
        async with httpx.AsyncClient() as client:
            response = await client.post(DEEPSEEK_API_URL, json=data, headers=headers)
            response.raise_for_status()
            logger.info("成功获取 Deepseek API 响应")
            return response.json()["choices"][0]["message"]["content"]
    except httpx.HTTPError as e:
        logger.error(f"调用 Deepseek API 时出错: {str(e)}")
        if response := getattr(e, 'response', None):
            logger.error(f"API 响应: {response.text}")
        raise HTTPException(status_code=500, detail=f"Failed to call Deepseek API: {str(e)}")
    except Exception as e:
        logger.error(f"其他错误: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 