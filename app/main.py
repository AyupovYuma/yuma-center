from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import builds, auth
from app.config import settings
from app.database import init_db
from app.routers import build_comments

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(builds.router)
app.include_router(auth.router)
app.include_router(build_comments.router)


@app.on_event("startup")
async def startup_event():
    await init_db()

# Обработка ошибок
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

@app.get('/')
def read_root():
    return {'message': f'Welcome to {settings.APP_NAME}'}
