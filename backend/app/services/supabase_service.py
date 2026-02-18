"""
CMC IP Marketplace - Supabase Service
Wrapper for Supabase client operations
"""

from supabase import create_client, Client
from app.core.config import settings
from typing import Optional, Dict, List, Any
import logging

logger = logging.getLogger(__name__)


class SupabaseService:
    """Supabase client wrapper with helper methods"""

    def __init__(self):
        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_key  # Use service key for backend operations
        )

    # ==========================================
    # User Operations
    # ==========================================

    async def create_user_profile(self, user_id: str, email: str, role: str, display_name: str) -> Dict:
        """Create user profile in users table"""
        try:
            response = self.client.table("users").insert({
                "id": user_id,
                "email": email,
                "role": role,
                "display_name": display_name
            }).execute()
            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating user profile: {e}")
            raise

    async def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Get user profile by ID"""
        try:
            response = self.client.table("users").select("*").eq("id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            raise

    # ==========================================
    # IP Listing Operations
    # ==========================================

    async def create_listing(self, creator_id: str, listing_data: Dict) -> Dict:
        """Create new IP listing"""
        try:
            data = {**listing_data, "creator_id": creator_id}
            response = self.client.table("ip_listings").insert(data).execute()
            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating listing: {e}")
            raise

    async def get_listing_by_id(self, listing_id: str) -> Optional[Dict]:
        """Get IP listing by ID"""
        try:
            response = self.client.table("ip_listings").select("*").eq("id", listing_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error getting listing: {e}")
            raise

    async def get_listings(
        self,
        status: Optional[str] = None,
        genre: Optional[str] = None,
        tier: Optional[str] = None,
        creator_id: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Dict]:
        """Get IP listings with filters"""
        try:
            query = self.client.table("ip_listings").select("*")

            if status:
                query = query.eq("status", status)
            if genre:
                query = query.eq("genre", genre)
            if tier:
                query = query.eq("tier", tier)
            if creator_id:
                query = query.eq("creator_id", creator_id)

            query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
            response = query.execute()
            return response.data
        except Exception as e:
            logger.error(f"Error getting listings: {e}")
            raise

    async def search_listings(self, query: str, limit: int = 20) -> List[Dict]:
        """Full-text search on listings"""
        try:
            response = self.client.table("ip_listings").select("*").text_search(
                "title,description",
                query
            ).eq("status", "published").limit(limit).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error searching listings: {e}")
            raise

    async def update_listing(self, listing_id: str, update_data: Dict) -> Dict:
        """Update IP listing"""
        try:
            response = self.client.table("ip_listings").update(update_data).eq("id", listing_id).execute()
            return response.data[0]
        except Exception as e:
            logger.error(f"Error updating listing: {e}")
            raise

    async def delete_listing(self, listing_id: str) -> bool:
        """Soft delete listing (set status to archived)"""
        try:
            await self.update_listing(listing_id, {"status": "archived"})
            return True
        except Exception as e:
            logger.error(f"Error deleting listing: {e}")
            raise

    # ==========================================
    # IP Materials Operations
    # ==========================================

    async def create_material(self, listing_id: str, material_type: str, content: Dict) -> Dict:
        """Create AI-generated material"""
        try:
            data = {
                "listing_id": listing_id,
                "type": material_type,
                "content": content
            }
            response = self.client.table("ip_materials").insert(data).execute()
            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating material: {e}")
            raise

    async def get_materials_by_listing(self, listing_id: str) -> List[Dict]:
        """Get all materials for a listing"""
        try:
            response = self.client.table("ip_materials").select("*").eq("listing_id", listing_id).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error getting materials: {e}")
            raise

    # ==========================================
    # Inquiry Operations
    # ==========================================

    async def create_inquiry(self, inquiry_data: Dict) -> Dict:
        """Create buyer inquiry"""
        try:
            response = self.client.table("inquiries").insert(inquiry_data).execute()
            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating inquiry: {e}")
            raise

    async def get_inquiries_by_listing(self, listing_id: str) -> List[Dict]:
        """Get inquiries for a listing"""
        try:
            response = self.client.table("inquiries").select("*").eq("listing_id", listing_id).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error getting inquiries: {e}")
            raise

    async def get_inquiries_by_buyer(self, buyer_id: str) -> List[Dict]:
        """Get inquiries by buyer"""
        try:
            response = self.client.table("inquiries").select("*").eq("buyer_id", buyer_id).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error getting buyer inquiries: {e}")
            raise

    # ==========================================
    # Favorites Operations
    # ==========================================

    async def add_favorite(self, buyer_id: str, listing_id: str) -> Dict:
        """Add listing to favorites"""
        try:
            response = self.client.table("favorites").insert({
                "buyer_id": buyer_id,
                "listing_id": listing_id
            }).execute()
            return response.data[0]
        except Exception as e:
            logger.error(f"Error adding favorite: {e}")
            raise

    async def remove_favorite(self, buyer_id: str, listing_id: str) -> bool:
        """Remove listing from favorites"""
        try:
            self.client.table("favorites").delete().eq("buyer_id", buyer_id).eq("listing_id", listing_id).execute()
            return True
        except Exception as e:
            logger.error(f"Error removing favorite: {e}")
            raise

    async def get_favorites(self, buyer_id: str) -> List[Dict]:
        """Get buyer's favorite listings"""
        try:
            response = self.client.table("favorites").select("*, ip_listings(*)").eq("buyer_id", buyer_id).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error getting favorites: {e}")
            raise

    # ==========================================
    # Storage Operations
    # ==========================================

    async def upload_file(self, bucket: str, path: str, file_data: bytes) -> str:
        """Upload file to Supabase Storage"""
        try:
            response = self.client.storage.from_(bucket).upload(path, file_data)
            public_url = self.client.storage.from_(bucket).get_public_url(path)
            return public_url
        except Exception as e:
            logger.error(f"Error uploading file: {e}")
            raise

    async def get_file_url(self, bucket: str, path: str, expires_in: int = 3600) -> str:
        """Get signed URL for private file"""
        try:
            response = self.client.storage.from_(bucket).create_signed_url(path, expires_in)
            return response["signedURL"]
        except Exception as e:
            logger.error(f"Error getting signed URL: {e}")
            raise


# Global service instance
supabase_service = SupabaseService()

def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    return supabase_service.client
