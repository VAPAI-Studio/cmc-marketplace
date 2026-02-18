"""
File Upload API Endpoints
Handle file uploads for IP materials (scripts, posters, concept art)
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional

from app.core.security import get_current_user
from app.services.supabase_service import get_supabase_client
from app.services.storage_service import get_storage_service
from app.models.user import UserProfile

router = APIRouter(prefix="/files", tags=["files"])


# Response Models
class FileUploadResponse(BaseModel):
    path: str
    url: str
    signed_url: str
    file_name: str
    type: str


class SignedUrlResponse(BaseModel):
    signed_url: str
    expires_in: int


# Allowed file types
ALLOWED_FILE_TYPES = {
    "script": [".pdf"],
    "poster": [".jpg", ".jpeg", ".png", ".webp"],
    "concept_art": [".jpg", ".jpeg", ".png", ".webp"]
}


@router.post("/upload", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    listing_id: str = Form(...),
    file_type: str = Form(..., regex="^(script|poster|concept_art)$"),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Upload file for an IP listing
    Only the creator who owns the listing can upload files
    """
    if current_user["role"] != "creator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only creators can upload files"
        )

    supabase = get_supabase_client()
    storage = get_storage_service(supabase)

    # Verify listing ownership
    try:
        listing = supabase.table("ip_listings") \
            .select("creator_id") \
            .eq("id", listing_id) \
            .single() \
            .execute()

        if not listing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found"
            )

        if listing.data["creator_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to upload files for this listing"
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to verify listing: {str(e)}"
        )

    # Validate file
    file_size = 0
    file_content = await file.read()
    file_size = len(file_content)

    is_valid, error_msg = storage.validate_file(
        file.filename,
        file_size,
        ALLOWED_FILE_TYPES.get(file_type, [])
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )

    # Upload file
    try:
        result = storage.upload_file(
            file=file_content,
            file_name=file.filename,
            user_id=current_user["id"],
            listing_id=listing_id,
            file_type=file_type
        )

        # Update listing with file URL
        update_field = f"{file_type}_url"
        if file_type == "concept_art":
            # For concept art, append to array
            existing_urls = listing.data.get("concept_art_urls", [])
            existing_urls.append(result["url"])
            supabase.table("ip_listings") \
                .update({"concept_art_urls": existing_urls}) \
                .eq("id", listing_id) \
                .execute()
        else:
            # For script and poster, update single URL field
            supabase.table("ip_listings") \
                .update({update_field: result["url"]}) \
                .eq("id", listing_id) \
                .execute()

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File upload failed: {str(e)}"
        )


@router.post("/{listing_id}/signed-url", response_model=SignedUrlResponse)
async def get_signed_url(
    listing_id: str,
    file_type: str = Form(..., regex="^(script|poster|concept_art)$"),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Get signed URL for accessing a private file
    Only buyers with active subscription or the creator can access
    """
    supabase = get_supabase_client()
    storage = get_storage_service(supabase)

    # Get listing
    try:
        listing = supabase.table("ip_listings") \
            .select("creator_id, script_url, poster_url, concept_art_urls") \
            .eq("id", listing_id) \
            .single() \
            .execute()

        if not listing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found"
            )

        # Check permissions
        is_creator = listing.data["creator_id"] == current_user["id"]
        is_buyer_with_subscription = (
            current_user["role"] == "buyer" and
            current_user.get("subscription_status") == "active"
        )

        if not (is_creator or is_buyer_with_subscription):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You need an active subscription to access this file"
            )

        # Get file path from listing
        if file_type == "script":
            file_url = listing.data.get("script_url")
        elif file_type == "poster":
            file_url = listing.data.get("poster_url")
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Signed URLs only available for script and poster"
            )

        if not file_url:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {file_type} file found for this listing"
            )

        # Extract path from URL
        # URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
        path = file_url.split(f"{storage.bucket_name}/")[-1]

        # Generate signed URL (valid for 1 hour)
        signed_url = storage.get_signed_url(path, expires_in=3600)

        return {
            "signed_url": signed_url,
            "expires_in": 3600
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate signed URL: {str(e)}"
        )


@router.delete("/{listing_id}/file")
async def delete_file(
    listing_id: str,
    file_type: str = Form(..., regex="^(script|poster|concept_art)$"),
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Delete a file from a listing
    Only the creator who owns the listing can delete files
    """
    if current_user["role"] != "creator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only creators can delete files"
        )

    supabase = get_supabase_client()
    storage = get_storage_service(supabase)

    # Verify ownership and get file URL
    try:
        listing = supabase.table("ip_listings") \
            .select("creator_id, script_url, poster_url, concept_art_urls") \
            .eq("id", listing_id) \
            .single() \
            .execute()

        if not listing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found"
            )

        if listing.data["creator_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete files for this listing"
            )

        # Get file URL
        if file_type == "script":
            file_url = listing.data.get("script_url")
        elif file_type == "poster":
            file_url = listing.data.get("poster_url")
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only delete script or poster files individually"
            )

        if not file_url:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {file_type} file found"
            )

        # Extract path from URL
        path = file_url.split(f"{storage.bucket_name}/")[-1]

        # Delete from storage
        storage.delete_file(path)

        # Update listing to remove URL
        update_field = f"{file_type}_url"
        supabase.table("ip_listings") \
            .update({update_field: None}) \
            .eq("id", listing_id) \
            .execute()

        return {"message": f"{file_type} file deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete file: {str(e)}"
        )
