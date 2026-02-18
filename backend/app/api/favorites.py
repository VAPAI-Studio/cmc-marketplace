"""
Favorites API — buyers save/unsave listings
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.security import get_current_user
from app.services.supabase_service import get_supabase_client

router = APIRouter(prefix="/favorites", tags=["favorites"])


class FavoriteResponse(BaseModel):
    listing_id: str
    saved: bool


@router.get("/", response_model=List[str])
async def get_favorites(
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """Get list of listing IDs saved by current user"""
    result = supabase.table("favorites").select("listing_id").eq("buyer_id", current_user["id"]).execute()
    return [r["listing_id"] for r in result.data]


@router.post("/{listing_id}", response_model=FavoriteResponse)
async def save_favorite(
    listing_id: str,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """Save a listing to favorites"""
    # Check listing exists
    listing = supabase.table("ip_listings").select("id").eq("id", listing_id).eq("status", "published").single().execute()
    if not listing.data:
        raise HTTPException(status_code=404, detail="Listing not found")

    # Upsert (ignore if already saved)
    try:
        supabase.table("favorites").insert({
            "buyer_id": current_user["id"],
            "listing_id": listing_id,
        }).execute()
        # Increment save_count
        supabase.rpc("increment_save_count", {"listing_id": listing_id}).execute()
    except Exception:
        pass  # Already saved — that's fine

    return FavoriteResponse(listing_id=listing_id, saved=True)


@router.delete("/{listing_id}", response_model=FavoriteResponse)
async def unsave_favorite(
    listing_id: str,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """Remove a listing from favorites"""
    supabase.table("favorites").delete().eq("buyer_id", current_user["id"]).eq("listing_id", listing_id).execute()
    return FavoriteResponse(listing_id=listing_id, saved=False)


@router.get("/listings", response_model=List[dict])
async def get_saved_listings(
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """Get full listing details for all saved IPs"""
    favs = supabase.table("favorites").select("listing_id").eq("buyer_id", current_user["id"]).execute()
    if not favs.data:
        return []

    ids = [f["listing_id"] for f in favs.data]
    listings = supabase.table("ip_listings").select("*").in_("id", ids).eq("status", "published").execute()
    return listings.data
