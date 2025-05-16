from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.hash import bcrypt
from app.database import get_async_session
from app.schemas import DeveloperRegister, DeveloperInDB
from app.crub import (
    developer_by_login,
    create_project,
    get_project_by_name,
    create_developer
)
from app.services.filesystem import create_dev_folder

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/register', response_model=DeveloperInDB)
async def register(dev: DeveloperRegister, db: AsyncSession = Depends(get_async_session)):
    existing = await developer_by_login(db, dev.login)
    if existing:
        raise HTTPException(400, detail='Login already exists')

    project = await get_project_by_name(db, dev.project_name)
    if not project:
        project = await create_project(db, dev.project_name)

    folder_path = create_dev_folder(project.name, dev.login)

    hashed_pw = bcrypt.hash(dev.password)

    developer = await create_developer(
        db,
        name=dev.name,
        login=dev.login,
        hashed_password=hashed_pw,
        project_id=project.id
    )

    return DeveloperInDB.from_orm(developer)
