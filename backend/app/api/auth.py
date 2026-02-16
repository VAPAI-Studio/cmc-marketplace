"""
CMC IP Marketplace - Authentication Endpoints
Supabase Auth integration for user registration, login, logout
"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserProfile, LoginRequest, LoginResponse
from app.services.supabase_service import supabase_service
from typing import Dict
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/register", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Register a new user with Supabase Auth and create profile

    Flow:
    1. Create auth user in Supabase Auth (email + password)
    2. Create user profile in users table
    3. Return user profile
    """
    try:
        # Create user in Supabase Auth
        auth_response = supabase_service.client.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "display_name": user_data.display_name,
                    "role": user_data.role
                }
            }
        })

        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user account"
            )

        user_id = auth_response.user.id

        # Create user profile in users table
        profile = await supabase_service.create_user_profile(
            user_id=user_id,
            email=user_data.email,
            role=user_data.role,
            display_name=user_data.display_name
        )

        logger.info(f"User registered successfully: {user_data.email} ({user_data.role})")

        return UserProfile(**profile)

    except Exception as e:
        logger.error(f"Registration error: {e}")

        # Handle common Supabase errors
        error_msg = str(e)
        if "already registered" in error_msg.lower() or "already exists" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists"
            )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {error_msg}"
        )


@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Login with email and password

    Returns:
    - access_token: Supabase session token
    - user: User profile data
    """
    try:
        # Authenticate with Supabase
        auth_response = supabase_service.client.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })

        if not auth_response.user or not auth_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        user_id = auth_response.user.id
        access_token = auth_response.session.access_token

        # Get user profile
        profile = await supabase_service.get_user_by_id(user_id)

        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )

        logger.info(f"User logged in: {credentials.email}")

        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserProfile(**profile)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout():
    """
    Logout current user

    Note: This endpoint is primarily for consistency.
    Actual logout is handled on frontend by clearing the session token.
    Supabase tokens expire automatically.
    """
    try:
        # Sign out from Supabase (clears server-side session if any)
        supabase_service.client.auth.sign_out()
        logger.info("User logged out")
        return None
    except Exception as e:
        logger.error(f"Logout error: {e}")
        # Don't fail logout even if there's an error
        return None


@router.get("/me", response_model=UserProfile)
async def get_current_user(user_id: str):
    """
    Get current authenticated user profile

    Note: In production, user_id would come from JWT token validation.
    For MVP, we pass it from frontend (Supabase handles auth client-side).
    """
    try:
        profile = await supabase_service.get_user_by_id(user_id)

        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return UserProfile(**profile)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user profile"
        )


@router.get("/verify-email")
async def verify_email(token: str):
    """
    Verify email with token (if email confirmation is enabled)

    This is handled automatically by Supabase Auth.
    Users click the link in their email, Supabase verifies, redirects to app.
    """
    return {
        "message": "Email verification is handled by Supabase Auth",
        "status": "redirect to app after verification"
    }


@router.post("/reset-password")
async def request_password_reset(email: str):
    """
    Request password reset email
    """
    try:
        supabase_service.client.auth.reset_password_email(email)

        # Always return success (don't reveal if email exists)
        return {
            "message": "If an account exists with this email, you will receive a password reset link"
        }

    except Exception as e:
        logger.error(f"Password reset error: {e}")
        # Still return success (security best practice)
        return {
            "message": "If an account exists with this email, you will receive a password reset link"
        }


@router.post("/update-password")
async def update_password(user_id: str, new_password: str):
    """
    Update user password (after reset or in settings)

    Note: In production, user_id comes from authenticated session
    """
    try:
        # Update password in Supabase Auth
        supabase_service.client.auth.update_user({
            "password": new_password
        })

        logger.info(f"Password updated for user: {user_id}")

        return {"message": "Password updated successfully"}

    except Exception as e:
        logger.error(f"Password update error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update password"
        )
