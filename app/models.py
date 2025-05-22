from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base
from datetime import datetime


class Build(Base):
    __tablename__ = 'builds'

    id = Column(Integer, primary_key=True, index=True)
    developer_id = Column(Integer, ForeignKey('developers.id'), nullable=True)
    filename = Column(String)
    version = Column(String)
    description = Column(String)
    upload_time = Column(DateTime, default=datetime.utcnow)
    file_path = Column(String)

    developer = relationship('Developer', back_populates='builds')
    comments = relationship('BuildComment', back_populates='build')

# class Tester(Base):
#     __tablename__  = 'testers'
#
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, unique=True, index=True)
#     login = Column(String, unique=True, index=True)
#     hashed_password = Column(String)

class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    developers = relationship('Developer', back_populates='project')

class Developer(Base):
    __tablename__ = 'developers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    login = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project', back_populates='developers')
    builds = relationship('Build', back_populates='developer')


class BuildComment(Base):
    __tablename__ = 'build_comments'
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    build_id = Column(Integer, ForeignKey('builds.id'), nullable=False)
    developer_id = Column(Integer, ForeignKey('developers.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    build = relationship('Build', back_populates='comments')
    developer = relationship('Developer')


















