from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
from pydantic import BaseModel
import httpx
import os
import logging
import json
from dotenv import load_dotenv
import asyncio

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

@app.middleware("http")
async def handle_options(request: Request, call_next):
    if request.method == "OPTIONS":
        return JSONResponse(
            status_code=200,
            content={"message": "OK"}
        )
    response = await call_next(request)
    return response

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 自定义路由类来处理 OPTIONS 请求
class CustomAPIRoute(APIRoute):
    def get_route_handler(self):
        original_route_handler = super().get_route_handler()
        
        async def custom_route_handler(request: Request):
            if request.method == "OPTIONS":
                return JSONResponse(
                    status_code=200,
                    content={"message": "OK"}
                )
            return await original_route_handler(request)
            
        return custom_route_handler

# 使用自定义路由类
app.router.route_class = CustomAPIRoute

class ChatMessage(BaseModel):
    content: str

class ChatResponse(BaseModel):
    response: str

@app.post("/api/chat")
async def chat(message: ChatMessage):
    """处理聊天请求"""
    try:
        logger.info(f"收到聊天请求: {message.content}")
        # 根据环境变量选择使用哪个 API
        api_provider = os.getenv("API_PROVIDER", "deepseek").lower()
        logger.info(f"当前使用的 API 提供商: {api_provider}")
        
        if api_provider == "zhipu":
            logger.info("使用智谱 API")
            response_text = await get_zhipu_response(message.content)
        else:
            logger.info("使用 Deepseek API")
            response_text = await get_deepseek_response(message.content)
            
        logger.info(f"返回响应: {response_text}")
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error(f"处理聊天请求时出错: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def get_deepseek_response(message: str) -> str:
    """调用 Deepseek API 获取回答"""
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        logger.error("DEEPSEEK_API_KEY 未设置")
        raise ValueError("DEEPSEEK_API_KEY is not set")
        
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "system",
                "content": """你扮演音乐伙伴的角色，精通音乐理论和作曲。你会：
                1. 用简洁专业的语言回答问题，回答不超过150字
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
    
    max_retries = 3  # 最大重试次数
    retry_delay = 1  # 重试间隔（秒）
    
    for attempt in range(max_retries):
        try:
            logger.info(f"正在调用 Deepseek API (尝试 {attempt + 1}/{max_retries})")
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.deepseek.com/v1/chat/completions",
                    json=data,
                    headers=headers,
                    timeout=30.0
                )
                response.raise_for_status()
                response_data = response.json()
                logger.info("成功获取 Deepseek API 响应")
                logger.info(f"响应内容: {response_data}")
                if "choices" not in response_data or not response_data["choices"]:
                    raise ValueError("Invalid response format from Deepseek API")
                return response_data["choices"][0]["message"]["content"]
        except (httpx.HTTPError, Exception) as e:
            logger.error(f"调用 Deepseek API 时出错 (尝试 {attempt + 1}/{max_retries}): {str(e)}")
            if isinstance(e, httpx.HTTPError):
                logger.error(f"响应状态码: {e.response.status_code if hasattr(e, 'response') else 'Unknown'}")
                logger.error(f"响应内容: {e.response.text if hasattr(e, 'response') else 'Unknown'}")
            if attempt < max_retries - 1:  # 如果不是最后一次尝试
                await asyncio.sleep(retry_delay)  # 等待一段时间后重试
                continue
            raise HTTPException(status_code=500, detail=str(e))

async def get_zhipu_response(message: str) -> str:
    """调用智谱 API 获取回答"""
    api_key = os.getenv("ZHIPU_API_KEY")
    logger.info("正在获取智谱 API Key")
    
    if not api_key:
        logger.error("ZHIPU_API_KEY 未设置")
        raise ValueError("ZHIPU_API_KEY is not set")

    # 解析 API Key
    try:
        key_id, secret = api_key.split(".")
        logger.info(f"成功解析智谱 API Key，key_id: {key_id[:4]}...")
    except ValueError:
        logger.error("智谱 API Key 格式错误")
        raise ValueError("Invalid ZHIPU_API_KEY format")

    # 生成 JWT token
    import jwt
    import time
    
    timestamp = int(time.time())
    payload = {
        "api_key": key_id,
        "timestamp": timestamp,
        "exp": timestamp + 3600  # 1小时后过期
    }
    
    token = jwt.encode(
        payload,
        secret,
        algorithm="HS256",
        headers={"alg": "HS256", "sign_type": "SIGN"}  # 添加必要的头部信息
    )

    headers = {
        "Authorization": token,  # 直接使用 token，不加 Bearer 前缀
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "glm-4",  # 使用 GLM-4 模型
        "messages": [
            {
                "role": "system",
                "content": """你扮演音乐伙伴的角色，精通音乐理论和作曲。你会：
                1. 用简洁专业的语言回答问题，回答不超过150字
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
        "top_p": 0.7,
        "max_tokens": 1000,
        "stream": False
    }
    
    max_retries = 3  # 最大重试次数
    retry_delay = 1  # 重试间隔（秒）
    
    for attempt in range(max_retries):
        try:
            logger.info(f"正在调用智谱 API (尝试 {attempt + 1}/{max_retries})")
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://open.bigmodel.cn/api/paas/v4/chat/completions",
                    json=data,
                    headers=headers,
                    timeout=30.0  # 设置超时时间
                )
                response.raise_for_status()
                logger.info("成功获取智谱 API 响应")
                return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"调用智谱 API 时出错 (尝试 {attempt + 1}/{max_retries}): {str(e)}")
            if attempt < max_retries - 1:  # 如果不是最后一次尝试
                await asyncio.sleep(retry_delay)  # 等待一段时间后重试
                continue
            raise HTTPException(status_code=500, detail=str(e)) 