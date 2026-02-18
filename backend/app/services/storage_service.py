"""
Supabase Storage Service
Handles file uploads, downloads, and signed URLs for IP materials
"""
from typing import Optional, BinaryIO
import os
from datetime import timedelta
from supabase import Client
from app.core.config import settings

class StorageService:
    def __init__(self, supabase_client: Client):
        self.client = supabase_client
        self.bucket_name = "ip-materials"

    def upload_file(
        self,
        file: BinaryIO,
        file_name: str,
        user_id: str,
        listing_id: str,
        file_type: str = "script"  # script, poster, concept_art
    ) -> dict:
        """
        Upload file to Supabase Storage

        Args:
            file: File binary data
            file_name: Original file name
            user_id: Owner user ID
            listing_id: Associated listing ID
            file_type: Type of file (script, poster, concept_art)

        Returns:
            dict with url and signed_url
        """
        # Generate storage path: {user_id}/{listing_id}/{type}/{filename}
        file_extension = os.path.splitext(file_name)[1]
        storage_path = f"{user_id}/{listing_id}/{file_type}{file_extension}"

        try:
            # Upload to Supabase Storage
            response = self.client.storage.from_(self.bucket_name).upload(
                path=storage_path,
                file=file,
                file_options={"content-type": self._get_content_type(file_extension)}
            )

            # Get public URL
            public_url = self.client.storage.from_(self.bucket_name).get_public_url(storage_path)

            # Generate signed URL (valid for 1 hour)
            signed_url = self.get_signed_url(storage_path, expires_in=3600)

            return {
                "path": storage_path,
                "url": public_url,
                "signed_url": signed_url,
                "file_name": file_name,
                "type": file_type
            }

        except Exception as e:
            raise Exception(f"File upload failed: {str(e)}")

    def get_signed_url(self, path: str, expires_in: int = 3600) -> str:
        """
        Generate signed URL for private file access

        Args:
            path: File path in storage
            expires_in: Expiration time in seconds (default 1 hour)

        Returns:
            Signed URL string
        """
        try:
            response = self.client.storage.from_(self.bucket_name).create_signed_url(
                path=path,
                expires_in=expires_in
            )
            return response['signedURL']
        except Exception as e:
            raise Exception(f"Failed to generate signed URL: {str(e)}")

    def delete_file(self, path: str) -> bool:
        """
        Delete file from storage

        Args:
            path: File path in storage

        Returns:
            True if deleted successfully
        """
        try:
            self.client.storage.from_(self.bucket_name).remove([path])
            return True
        except Exception as e:
            raise Exception(f"File deletion failed: {str(e)}")

    def list_files(self, user_id: str, listing_id: str) -> list:
        """
        List all files for a listing

        Args:
            user_id: Owner user ID
            listing_id: Listing ID

        Returns:
            List of file objects
        """
        try:
            prefix = f"{user_id}/{listing_id}/"
            response = self.client.storage.from_(self.bucket_name).list(prefix)
            return response
        except Exception as e:
            raise Exception(f"Failed to list files: {str(e)}")

    def _get_content_type(self, file_extension: str) -> str:
        """Get MIME type from file extension"""
        content_types = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.gif': 'image/gif'
        }
        return content_types.get(file_extension.lower(), 'application/octet-stream')

    def validate_file(self, file_name: str, file_size: int, allowed_types: list) -> tuple[bool, Optional[str]]:
        """
        Validate file before upload

        Args:
            file_name: File name with extension
            file_size: File size in bytes
            allowed_types: List of allowed extensions (e.g., ['.pdf', '.jpg'])

        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check file extension
        file_extension = os.path.splitext(file_name)[1].lower()
        if file_extension not in allowed_types:
            return False, f"File type {file_extension} not allowed. Allowed types: {', '.join(allowed_types)}"

        # Check file size (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB in bytes
        if file_size > max_size:
            return False, f"File size {file_size / 1024 / 1024:.2f}MB exceeds maximum of 10MB"

        return True, None


# Singleton instance
_storage_service: Optional[StorageService] = None

def get_storage_service(supabase_client: Client) -> StorageService:
    """Get or create storage service instance"""
    global _storage_service
    if _storage_service is None:
        _storage_service = StorageService(supabase_client)
    return _storage_service
