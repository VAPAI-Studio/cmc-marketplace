"""
Inquiries API — buyers contact creators about listings
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr

from app.core.security import get_current_user
from app.services.supabase_service import get_supabase_client

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


class InquiryCreate(BaseModel):
    listing_id: str
    message: str
    buyer_contact_email: str
    buyer_name: Optional[str] = None
    company_name: Optional[str] = None


class InquiryResponse(BaseModel):
    id: str
    listing_id: str
    buyer_id: Optional[str] = None
    buyer_name: Optional[str] = None
    buyer_contact_email: str
    company_name: Optional[str] = None
    message: str
    status: str
    created_at: str


@router.post("/", response_model=InquiryResponse, status_code=201)
async def create_inquiry(
    inquiry: InquiryCreate,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """Send an inquiry about a listing"""
    # Verify listing exists
    listing = supabase.table("ip_listings").select("id, title").eq("id", inquiry.listing_id).eq("status", "published").single().execute()
    if not listing.data:
        raise HTTPException(status_code=404, detail="Listing not found")

    result = supabase.table("inquiries").insert({
        "listing_id": inquiry.listing_id,
        "buyer_id": current_user["id"],
        "buyer_contact_email": inquiry.buyer_contact_email,
        "buyer_name": inquiry.buyer_name or current_user.get("display_name"),
        "company_name": inquiry.company_name,
        "message": inquiry.message,
        "status": "new",
    }).execute()

    # Increment inquiry_count on listing
    try:
        listing_data = supabase.table("ip_listings").select("inquiry_count").eq("id", inquiry.listing_id).single().execute()
        supabase.table("ip_listings").update({
            "inquiry_count": (listing_data.data.get("inquiry_count") or 0) + 1
        }).eq("id", inquiry.listing_id).execute()
    except Exception:
        pass

    return result.data[0]


@router.get("/sent", response_model=List[InquiryResponse])
async def get_sent_inquiries(
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """Get inquiries sent by current buyer"""
    result = supabase.table("inquiries").select("*").eq("buyer_id", current_user["id"]).order("created_at", desc=True).execute()
    return result.data


@router.get("/received", response_model=List[dict])
async def get_received_inquiries(
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """Get inquiries received for creator's listings"""
    # Get creator's listing IDs
    listings = supabase.table("ip_listings").select("id, title").eq("creator_id", current_user["id"]).execute()
    if not listings.data:
        return []

    listing_ids = [l["id"] for l in listings.data]
    listing_map = {l["id"]: l["title"] for l in listings.data}

    inquiries = supabase.table("inquiries").select("*").in_("listing_id", listing_ids).order("created_at", desc=True).execute()

    # Attach listing title
    result = []
    for inq in inquiries.data:
        inq["listing_title"] = listing_map.get(inq["listing_id"], "Unknown")
        result.append(inq)
    return result
