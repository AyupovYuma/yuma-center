# database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite+aiosqlite:///./app.db"

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


# Функция для получения сессии (будет использоваться в Dependency Injection)
# async def get_db() -> AsyncSession:
#     async with async_session() as session:
#         yield session


# Создание таблиц при запуске
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_async_session() -> AsyncSession:
    async with async_session() as session:
        yield session