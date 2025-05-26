from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException, Query
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
    get_all_projects, get_latest_build_by_filename
)
from app.crub import get_builds_by_project  # Нужно реализовать эту функцию

router = APIRouter(prefix='/builds', tags=['builds'])


@router.post('/upload')
async def upload_build(
        developer_login: str = Form(...),
        version: str = Form(...),
        description: str = Form(...),
        file: UploadFile = File(...),
        project_id: int = Form(...),
        db: AsyncSession = Depends(get_async_session)
):
    # 1. Получаем проект по ID
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(404, detail="Project not found")

    # 2. Находим разработчика по login
    result = await db.execute(
        select(Developer)
        .where(Developer.login == developer_login)
    )
    developer = result.scalar_one_or_none()
    if not developer:
        raise HTTPException(404, detail="Developer not found")

    # 3. Проверка: есть ли уже такая версия в этом проекте
    result = await db.execute(
        select(Build)
        .where(
            Build.project_id == project_id,
            Build.version == version
        )
    )
    existing_build = result.scalar_one_or_none()
    if existing_build:
        raise HTTPException(400, detail=f"Version {version} already exists for this project")

    # 4. Сохраняем файл
    file_path = await build_service.save_uploaded_file(
        file=file,
        project_id=project_id,
        developer_login=developer.login,
        version=version
    )

    build = await build_service.register_build_in_db(
        db=db,
        developer_id=developer.id,
        project_id=project_id,  # Теперь функция принимает этот параметр
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
        version: str | None = Query(default=None),
        db: AsyncSession = Depends(get_async_session)
):
    if version:
        build = await get_build_by_developer_and_filename(db, developer_id, filename, version)
    else:
        build = await get_latest_build_by_filename(db, developer_id, filename)

    if not build:
        raise HTTPException(status_code=404, detail="Build not found")

    return FileResponse(build.file_path, filename=build.filename)


@router.get('/project/{project_id}')
async def builds_by_project(
    project_id: int,
    sort: str = "newest",
    db: AsyncSession = Depends(get_async_session)
):
    stmt = (
        select(Build)
        .where(Build.project_id == project_id)
        .options(
            selectinload(Build.comments),
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