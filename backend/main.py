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

# =====================================================
# Configuration Area - Modify API Provider here
# "deepseek" - Use Deepseek API
# "zhipu" - Use Zhipu API
API_PROVIDER = "deepseek"
# =====================================================

# Configure logging
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

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom route class to handle OPTIONS requests
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

# Use custom route class
app.router.route_class = CustomAPIRoute

class ChatMessage(BaseModel):
    content: str

class ChatResponse(BaseModel):
    response: str

@app.post("/api/chat")
async def chat(message: ChatMessage):
    """Handle chat requests"""
    try:
        logger.info(f"Received chat request: {message.content}")
        # Use globally configured API provider
        api_provider = API_PROVIDER
        logger.info(f"Current API provider: {api_provider}")
        
        if api_provider == "zhipu":
            logger.info("Using Zhipu API")
            response_text = await get_zhipu_response(message.content)
        else:
            logger.info("Using Deepseek API")
            response_text = await get_deepseek_response(message.content)
            
        logger.info(f"Returning response: {response_text}")
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def get_deepseek_response(message: str) -> str:
    """Call Deepseek API to get response"""
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        logger.error("DEEPSEEK_API_KEY not set")
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
                "content": """You play the role of a music companion, proficient in music theory and composition. You will:
                1. Answer questions in concise professional language, with responses under 150 characters
                2. Provide specific suggestions and examples
                3. When discussing chords, provide both chord symbols and specific notes
                4. Respond in the same language as the user's query - if the user asks in Chinese, respond in Chinese; if the user asks in English, respond in English"""
            },
            {
                "role": "user",
                "content": message
            }
        ],
        "temperature": 0.7,
        "max_tokens": 1000
    }
    
    max_retries = 3  # Maximum retry attempts
    retry_delay = 1  # Retry interval (seconds)
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Calling Deepseek API (attempt {attempt + 1}/{max_retries})")
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.deepseek.com/v1/chat/completions",
                    json=data,
                    headers=headers,
                    timeout=30.0
                )
                response.raise_for_status()
                response_data = response.json()
                logger.info("Successfully received Deepseek API response")
                logger.info(f"Response content: {response_data}")
                if "choices" not in response_data or not response_data["choices"]:
                    raise ValueError("Invalid response format from Deepseek API")
                return response_data["choices"][0]["message"]["content"]
        except (httpx.HTTPError, Exception) as e:
            logger.error(f"Error calling Deepseek API (attempt {attempt + 1}/{max_retries}): {str(e)}")
            if isinstance(e, httpx.HTTPError):
                logger.error(f"Response status code: {e.response.status_code if hasattr(e, 'response') else 'Unknown'}")
                logger.error(f"Response content: {e.response.text if hasattr(e, 'response') else 'Unknown'}")
            if attempt < max_retries - 1:  # If not the last attempt
                await asyncio.sleep(retry_delay)  # Wait before retrying
                continue
            raise HTTPException(status_code=500, detail=str(e))

async def get_zhipu_response(message: str) -> str:
    """Call Zhipu API to get response"""
    api_key = os.getenv("ZHIPU_API_KEY")
    logger.info("Getting Zhipu API Key")
    
    if not api_key:
        logger.error("ZHIPU_API_KEY not set")
        raise ValueError("ZHIPU_API_KEY is not set")

    # Parse API Key
    try:
        key_id, secret = api_key.split(".")
        logger.info(f"Successfully parsed Zhipu API Key, key_id: {key_id[:4]}...")
    except ValueError:
        logger.error("Invalid Zhipu API Key format")
        raise ValueError("Invalid ZHIPU_API_KEY format")

    # Generate JWT token
    import jwt
    import time
    
    timestamp = int(time.time())
    payload = {
        "api_key": key_id,
        "timestamp": timestamp,
        "exp": timestamp + 3600  # Expires in 1 hour
    }
    
    token = jwt.encode(
        payload,
        secret,
        algorithm="HS256",
        headers={"alg": "HS256", "sign_type": "SIGN"}  # Add necessary header information
    )

    headers = {
        "Authorization": token,  # Use token directly, without Bearer prefix
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "glm-4",  # Use GLM-4 model
        "messages": [
            {
                "role": "system",
                "content": """You play the role of a music companion, proficient in music theory and composition. You will:
                1. Answer questions in concise professional language, with responses under 150 characters
                2. Provide specific suggestions and examples
                3. When discussing chords, provide both chord symbols and specific notes
                4. Respond in the same language as the user's query - if the user asks in Chinese, respond in Chinese; if the user asks in English, respond in English"""
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
    
    max_retries = 3  # Maximum retry attempts
    retry_delay = 1  # Retry interval (seconds)
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Calling Zhipu API (attempt {attempt + 1}/{max_retries})")
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://open.bigmodel.cn/api/paas/v4/chat/completions",
                    json=data,
                    headers=headers,
                    timeout=30.0  # Set timeout
                )
                response.raise_for_status()
                logger.info("Successfully received Zhipu API response")
                return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"Error calling Zhipu API (attempt {attempt + 1}/{max_retries}): {str(e)}")
            if attempt < max_retries - 1:  # If not the last attempt
                await asyncio.sleep(retry_delay)  # Wait before retrying
                continue
            raise HTTPException(status_code=500, detail=str(e)) 