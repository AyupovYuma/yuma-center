'''Pydantic-модели для валидации запросов/ответов.'''

from pydantic import BaseModel
from datetime import datetime

# ==== Project ====
class ProjectBase(BaseModel):
    name: str

class ProjectInDB(ProjectBase):
    id: int

    class Config:
        from_attributes = True


class ProjectCreate(ProjectBase):
    pass


#  ==== Developer =======

class DeveloperBase(BaseModel):
    login: str

class DeveloperCreate(DeveloperBase):
    password: str
    project_id: int

class DeveloperInDB(DeveloperBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True

class DeveloperRegister(BaseModel):
    login: str
    password: str
    name: str
    project_name: str

#  ==== Build ====
class BuildBase(BaseModel):
    version: str
    description: str

class BuildCreate(BuildBase):
    filename: str

class BuildInDB(BuildBase):
    id: int
    developer_id: int
    filename: str
    upload_time: datetime
    file_path: str

    class Config:
        from_attributes = True

'''Схема для комментариев к сборкам'''

class BuildCommentCreate(BaseModel):
    text: str
    developer_id: int

class BuildCommentRead(BaseModel):
    id: int
    text: str
    developer_id: int
    build_id: int
    created_at: datetime

    class Config:
        from_attributes = True
    
    
