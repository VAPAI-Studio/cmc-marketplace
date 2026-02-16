"""
CMC IP Marketplace - User Profile Endpoints
Manage user profiles and settings
"""

from fastapi import APIRouter, HTTPException, status, UploadFile, File
from app.models.user import UserProfile, UserUpdate
from app.services.supabase_service import supabase_service
import logging
from typing import Optional

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/me", response_model=UserProfile)
async def get_my_profile(user_id: str):
    """
    Get current user's profile

    Note: user_id would come from JWT token in production
    For MVP, passed as query param (Supabase handles auth client-side)
    """
    try:
        profile = await supabase_service.get_user_by_id(user_id)

        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )

        return UserProfile(**profile)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile"
        )


@router.put("/me", response_model=UserProfile)
async def update_my_profile(user_id: str, update_data: UserUpdate):
    """
    Update current user's profile
    """
    try:
        # Only update fields that are provided
        update_dict = update_data.model_dump(exclude_unset=True)

        if not update_dict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )

        # Update in database
        response = supabase_service.client.table("users").update(
            update_dict
        ).eq("id", user_id).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        updated_profile = response.data[0]
        logger.info(f"Profile updated for user: {user_id}")

        return UserProfile(**updated_profile)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )


@router.post("/me/avatar", response_model=UserProfile)
async def upload_avatar(user_id: str, file: UploadFile = File(...)):
    """
    Upload user avatar image

    Accepts: JPG, PNG, WEBP
    Max size: 5MB
    """
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
            )

        # Validate file size (5MB max)
        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File too large. Maximum size: 5MB"
            )

        # Upload to Supabase Storage
        file_extension = file.filename.split(".")[-1]
        storage_path = f"avatars/{user_id}.{file_extension}"

        avatar_url = await supabase_service.upload_file(
            bucket="ip-materials",  # Using same bucket for now
            path=storage_path,
            file_data=contents
        )

        # Update user profile with avatar URL
        response = supabase_service.client.table("users").update({
            "avatar_url": avatar_url
        }).eq("id", user_id).execute()

        updated_profile = response.data[0]
        logger.info(f"Avatar uploaded for user: {user_id}")

        return UserProfile(**updated_profile)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading avatar: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload avatar"
        )


@router.delete("/me/avatar", status_code=status.HTTP_204_NO_CONTENT)
async def delete_avatar(user_id: str):
    """
    Remove user avatar
    """
    try:
        # Update profile to remove avatar URL
        supabase_service.client.table("users").update({
            "avatar_url": None
        }).eq("id", user_id).execute()

        logger.info(f"Avatar removed for user: {user_id}")
        return None

    except Exception as e:
        logger.error(f"Error deleting avatar: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete avatar"
        )


@router.get("/{user_id}", response_model=UserProfile)
async def get_user_by_id(user_id: str):
    """
    Get public user profile by ID

    This is for displaying creator info on IP listings, etc.
    Only returns public fields.
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
        logger.error(f"Error getting user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user"
        )
