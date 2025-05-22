'''Операции с базой данных.'''

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models import Build, Developer, Project, BuildComment
from datetime import datetime

'''Project'''


async def create_project(db: AsyncSession, name: str) -> Project:
    new_project = Project(name=name)
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project


async def get_all_projects(db: AsyncSession) -> list[Project]:
    result = await db.execute(select(Project))
    return result.scalars().all()


''' Developers '''


async def create_developer(db: AsyncSession, name: str, login: str,
                           hashed_password: str, project_id: int) -> Developer:
    dev = Developer(name=name, login=login, hashed_password=hashed_password, project_id=project_id)
    db.add(dev)
    await db.commit()
    await db.refresh(dev)
    return dev


async def developer_by_login(db: AsyncSession, login: str) -> Developer | None:
    result = await db.execute(
        select(Developer)
        .options(selectinload(Developer.project))
        .where(Developer.login == login)
    )
    return result.scalar_one_or_none()


''' Build'''


async def create_build(db: AsyncSession, build_data: dict) -> Build:
    new_build = Build(**build_data)
    db.add(new_build)
    await db.commit()
    await db.refresh(new_build)
    return new_build


async def get_builds_by_developer(db: AsyncSession, developer_id: int) -> list[Build]:
    result = await db.execute(select(Build).where(Build.developer_id == developer_id))
    return result.scalars().all()


async def get_build_by_developer_and_filename(db: AsyncSession, developer_id: int,
                                              filename: str) -> Build | None:
    result = await db.execute(
        select(Build).where(
            (Build.developer_id == developer_id) &
            (Build.filename == filename)
        )
    )
    return result.scalar_one_or_none()

async def get_project_by_name(db: AsyncSession, name: str) -> Project | None:
    result = await db.execute(select(Project).where(Project.name == name))
    return result.scalar_one_or_none()

async def create_build_comment(
    db: AsyncSession,
    build_id: int,
    text: str,
    developer_id: int | None = None
) -> BuildComment:
    comment = BuildComment(build_id=build_id, text=text, created_at=datetime.utcnow())
    if developer_id is not None:
        comment.developer_id = developer_id
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment


async def get_build_comments(db: AsyncSession, build_id: int) -> list[BuildComment]:
    result = await db.execute(select(BuildComment).where(BuildComment.build_id == build_id))
    return result.scalars().all()

async def get_builds_by_project(db: AsyncSession, project_id: int) -> list[Build]:
    from app.models import Build, Developer
    from sqlalchemy import select
    result = await db.execute(
        select(Build).join(Developer).where(Developer.project_id == project_id)
    )
    return result.scalars().all()

