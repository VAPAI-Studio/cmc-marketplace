"""
CMC IP Marketplace - User Models
Pydantic models for user data validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    """User role types"""
    CREATOR = "creator"
    BUYER = "buyer"
    ADMIN = "admin"


class UserCreate(BaseModel):
    """User registration data"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole
    display_name: str = Field(..., min_length=2, max_length=100)


class UserProfile(BaseModel):
    """User profile data"""
    id: str
    email: EmailStr
    role: UserRole
    display_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    company_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    """User profile update data"""
    display_name: Optional[str] = Field(None, min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = None
    company_name: Optional[str] = None


class LoginRequest(BaseModel):
    """Login credentials"""
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Login response with tokens"""
    access_token: str
    token_type: str = "bearer"
    user: UserProfile
