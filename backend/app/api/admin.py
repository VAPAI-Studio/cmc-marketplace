"""
Admin API — moderation and management
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.security import get_current_user
from app.services.supabase_service import get_supabase_client

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/listings")
async def admin_list_listings(
    status: Optional[str] = None,
    current_user: dict = Depends(require_admin),
    supabase=Depends(get_supabase_client),
):
    """Get all listings regardless of status"""
    query = supabase.table("ip_listings").select("*").order("created_at", desc=True)
    if status:
        query = query.eq("status", status)
    result = query.execute()
    return result.data


@router.put("/listings/{listing_id}/approve")
async def approve_listing(
    listing_id: str,
    current_user: dict = Depends(require_admin),
    supabase=Depends(get_supabase_client),
):
    """Publish a listing"""
    result = supabase.table("ip_listings").update({"status": "published"}).eq("id", listing_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"id": listing_id, "status": "published"}


@router.put("/listings/{listing_id}/reject")
async def reject_listing(
    listing_id: str,
    current_user: dict = Depends(require_admin),
    supabase=Depends(get_supabase_client),
):
    """Unpublish/archive a listing"""
    result = supabase.table("ip_listings").update({"status": "archived"}).eq("id", listing_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"id": listing_id, "status": "archived"}


@router.put("/listings/{listing_id}/feature")
async def toggle_featured(
    listing_id: str,
    featured: bool = True,
    current_user: dict = Depends(require_admin),
    supabase=Depends(get_supabase_client),
):
    """Toggle featured status"""
    result = supabase.table("ip_listings").update({"featured": featured}).eq("id", listing_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"id": listing_id, "featured": featured}


@router.get("/users")
async def admin_list_users(
    current_user: dict = Depends(require_admin),
    supabase=Depends(get_supabase_client),
):
    """List all users"""
    result = supabase.table("users").select("id, email, role, display_name, created_at").order("created_at", desc=True).execute()
    return result.data


@router.get("/inquiries")
async def admin_list_inquiries(
    current_user: dict = Depends(require_admin),
    supabase=Depends(get_supabase_client),
):
    """List all inquiries with listing titles"""
    result = supabase.table("inquiries").select("*").order("created_at", desc=True).execute()
    inquiries = result.data

    # Attach listing titles
    if inquiries:
        listing_ids = list({i["listing_id"] for i in inquiries})
        listings = supabase.table("ip_listings").select("id, title").in_("id", listing_ids).execute()
        listing_map = {l["id"]: l["title"] for l in listings.data}
        for inq in inquiries:
            inq["listing_title"] = listing_map.get(inq["listing_id"], "Unknown")

    return inquiries


@router.get("/stats")
async def admin_stats(
    current_user: dict = Depends(require_admin),
    supabase=Depends(get_supabase_client),
):
    """Global platform stats"""
    listings = supabase.table("ip_listings").select("status").execute()
    users = supabase.table("users").select("role").execute()
    inquiries = supabase.table("inquiries").select("id").execute()

    status_counts = {}
    for l in listings.data:
        s = l["status"]
        status_counts[s] = status_counts.get(s, 0) + 1

    role_counts = {}
    for u in users.data:
        r = u["role"]
        role_counts[r] = role_counts.get(r, 0) + 1

    return {
        "listings": status_counts,
        "total_listings": len(listings.data),
        "users": role_counts,
        "total_users": len(users.data),
        "total_inquiries": len(inquiries.data),
    }
