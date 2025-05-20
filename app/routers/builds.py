from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pathlib import Path

from app.models import Build, Developer, Project
from app.database import get_async_session
from app.schemas import BuildInDB, ProjectInDB
from app.services import builds as build_service
from app.crub import (
    get_builds_by_developer,
    get_build_by_developer_and_filename,
    developer_by_login,  # Новая функция для поиска по имени
    get_all_projects
)
from app.crub import get_builds_by_project  # Нужно реализовать эту функцию

router = APIRouter(prefix='/builds', tags=['builds'])


@router.post('/upload')
async def upload_build(
        developer_login: str = Form(...),  # Изменил dev_name на developer_login
        version: str = Form(...),
        description: str = Form(...),
        file: UploadFile = File(...),
        db: AsyncSession = Depends(get_async_session)
):
    # 1. Находим разработчика по логину
    developer = await developer_by_login(db, developer_login)
    if not developer:
        raise HTTPException(404, detail="Developer not found")

    # 2. Проверяем существование сборки
    existing_build = await get_build_by_developer_and_filename(
        db, developer.id, file.filename
    )
    if existing_build:
        raise HTTPException(400, detail=f'Version {version} already exists')

    # 3. Сохраняем файл
    file_path = await build_service.save_uploaded_file(
    file,
    developer.project.name,
    developer.login
)

    # 4. Регистрируем в БД
    build = await build_service.register_build_in_db(
        db=db,
        developer_id=developer.id,  # Передаём ID вместо имени
        version=version,
        description=description,
        filename=file.filename,
        file_path=file_path
    )

    return BuildInDB.from_orm(build)


@router.get('/developer/{developer_id}')
async def list_builds(
        developer_id: int,
        db: AsyncSession = Depends(get_async_session)
):
    builds = await get_builds_by_developer(db, developer_id)
    return [BuildInDB.from_orm(build) for build in builds]


@router.get('/download/{developer_id}/{filename}')
async def download_build(
        developer_id: int,
        filename: str,
        db: AsyncSession = Depends(get_async_session)
):
    build = await get_build_by_developer_and_filename(db, developer_id, filename)
    if not build:
        raise HTTPException(404, detail='File not found')
    return FileResponse(build.file_path, filename=filename)


@router.get('/project/{project_id}')
async def builds_by_project(
    project_id: int,
    sort: str = "newest",
    db: AsyncSession = Depends(get_async_session)
):
    # Получаем все сборки через разработчиков проекта
    stmt = (
        select(Build)
        .join(Developer)
        .where(Developer.project_id == project_id)
        .options(
            selectinload(Build.comments),  # Явная загрузка комментариев
            selectinload(Build.developer)
        )
    )

    if sort == "newest":
        stmt = stmt.order_by(Build.upload_time.desc())
    elif sort == "oldest":
        stmt = stmt.order_by(Build.upload_time.asc())

    result = await db.execute(stmt)
    return result.scalars().all()


@router.get('/', response_model=list[ProjectInDB])
async def all_projects(db: AsyncSession = Depends(get_async_session)):
    return await get_all_projects(db)