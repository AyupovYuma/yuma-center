from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta, datetime
from jose import JWTError, jwt
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
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

ACCESS_TOKEN_EXPIRE_MINUTES = 30
SECRET_KEY = "your-secret-key"  # Замените на надежный ключ
ALGORITHM = "HS256"


@router.post('/register', response_model=DeveloperInDB)
async def register(
        dev: DeveloperRegister,
        db: AsyncSession = Depends(get_async_session)
):
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


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_developer(
        token: str = Depends(oauth2_scheme),
        db: AsyncSession = Depends(get_async_session)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get("sub")
        if login is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    developer = await developer_by_login(db, login)
    if developer is None:
        raise credentials_exception

    return developer


@router.post('/login')
async def login(
        username: str = Form(...),
        password: str = Form(...),
        db: AsyncSession = Depends(get_async_session)
):
    developer = await developer_by_login(db, username)
    if not developer or not bcrypt.verify(password, developer.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(
        data={"sub": developer.login}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "login": developer.login
    }


@router.get("/me")
async def read_current_developer(
        current_developer: DeveloperInDB = Depends(get_current_developer)
):
    return current_developer
