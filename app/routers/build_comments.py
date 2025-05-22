print("build_comments router loaded")

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.crub import create_build_comment, get_build_comments
from app.database import get_async_session
from app.schemas import CommentCreate, BuildCommentRead
router = APIRouter()

# @router.post(
#     '/builds/{build_id}/comments',
#     response_model=BuildCommentRead,
#     summary='comment for build',
#     description='create comment for build by build id'
# )
# async def add_comment(
#     build_id: int,
#     comment: CommentCreate,
#     db: AsyncSession = Depends(get_async_session)
# ):
#     return await create_build_comment(db, build_id, comment.text, comment.developer_id)

@router.post("/builds/{build_id}/comments", response_model=BuildCommentRead)
async def add_comment(
    build_id: int,
    comment: CommentCreate,
    db: AsyncSession = Depends(get_async_session),
):
    return await create_build_comment(
        db=db,
        build_id=build_id,
        text=comment.text,
        developer_id=comment.developer_id  # может быть None
    )
@router.get(
    '/builds/{build_id}/comments',
    response_model=list[BuildCommentRead],
    summary='get comments for build'
)
async def all_comments(
    build_id: int,
    db: AsyncSession = Depends(get_async_session)
):
    return await get_build_comments(db, build_id)
