'''Бизнес-логика работы с файлами и БД'''

from pathlib import Path
import aiofiles
from fastapi import UploadFile
from app.crub import create_build
from app.models import Build


async def save_uploaded_file(file: UploadFile, project_name: str, developer_login: str) -> str:
    """сохроняем файл в папку разраба и возвращаем путь"""
    upload_dir = Path('storage') / project_name / developer_login
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / file.filename

    async with aiofiles.open(file_path, 'wb') as buffer:
        await buffer.write(await file.read())

    return str(file_path)


async def register_build_in_db(db, developer_id: int, version: str, description: str,
                               filename: str, file_path: str):
    build_data = {
        'developer_id': developer_id,
        'version': version,
        'description': description,
        'filename': filename,
        'file_path': file_path
    }
    return await create_build(db, build_data)
