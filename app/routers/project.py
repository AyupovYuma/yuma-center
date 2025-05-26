from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_async_session
from app.models import Project
from app.schemas import ProjectCreate, ProjectInDB
from app.services.filesystem import create_dev_folder
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError  # Добавляем импорт

router = APIRouter(prefix='/projects', tags=['projects'])

@router.post('/', response_model=ProjectInDB)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_async_session)
):
    try:
        # Проверяем существование проекта
        existing = await db.execute(
            select(Project).where(Project.name == project.name)
        )
        if existing.scalars().first():
            raise HTTPException(
                status_code=400,
                detail=f'Project with name "{project.name}" already exists'
            )

        # Создаем новый проект
        new_project = Project(name=project.name)
        db.add(new_project)
        await db.commit()
        await db.refresh(new_project)

        # Создаем папку для проекта
        create_dev_folder(project.name, 'default')

        return new_project

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f'Project with name "{project.name}" already exists'
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f'Error creating project: {str(e)}'
        )