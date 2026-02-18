"""
IP Listings API Endpoints
CRUD operations for intellectual property listings
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, Field, validator
from datetime import datetime

from app.core.security import get_current_user
from app.services.supabase_service import get_supabase_client
from app.models.user import UserProfile

router = APIRouter(prefix="/listings", tags=["listings"])


# Request/Response Models
class ListingCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    tagline: Optional[str] = Field(None, max_length=300)
    description: str = Field(..., min_length=10)
    genre: str
    format: str  # Series, Film, Limited Series, Short
    tier: str = "hidden-gem"  # flagship, strong, hidden-gem

    # Setting & Context
    period: Optional[str] = None
    location: Optional[str] = None
    world_type: Optional[str] = None
    themes: Optional[List[str]] = []
    target_audience: Optional[str] = None

    # Market Data
    comparables: Optional[List[str]] = []
    logline: Optional[str] = None

    # Rights Information
    rights_holder: Optional[str] = None
    rights_holder_contact: Optional[str] = None
    available_rights: Optional[List[str]] = []
    available_territories: Optional[List[str]] = []


class ListingUpdate(BaseModel):
    title: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    genre: Optional[str] = None
    format: Optional[str] = None
    tier: Optional[str] = None
    period: Optional[str] = None
    location: Optional[str] = None
    world_type: Optional[str] = None
    themes: Optional[List[str]] = None
    target_audience: Optional[str] = None
    comparables: Optional[List[str]] = None
    logline: Optional[str] = None
    rights_holder: Optional[str] = None
    rights_holder_contact: Optional[str] = None
    available_rights: Optional[List[str]] = None
    available_territories: Optional[List[str]] = None
    status: Optional[str] = None  # draft, pending, published, archived


class ListingResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    creator_id: str
    title: str
    tagline: Optional[str] = None
    description: str
    slug: str
    genre: str
    format: str
    tier: str = "hidden-gem"
    period: Optional[str] = None
    location: Optional[str] = None
    world_type: Optional[str] = None
    themes: List[str] = []
    target_audience: Optional[str] = None
    comparables: List[str] = []
    logline: Optional[str] = None
    rights_holder: Optional[str] = None
    rights_holder_contact: Optional[str] = None
    available_rights: List[str] = []
    available_territories: List[str] = []
    script_url: Optional[str] = None
    poster_url: Optional[str] = None
    concept_art_urls: List[str] = []
    ai_analysis_status: str = "pending"
    ai_score: Optional[float] = None
    ai_strengths: List[str] = []
    ai_improvements: List[str] = []
    status: str = "draft"
    featured: bool = False
    view_count: int = 0
    save_count: int = 0
    inquiry_count: int = 0
    created_at: datetime
    updated_at: datetime

    @validator('themes', 'comparables', 'available_rights', 'available_territories',
               'concept_art_urls', 'ai_strengths', 'ai_improvements', pre=True)
    def none_to_empty_list(cls, v):
        return v if v is not None else []


# Endpoints

@router.post("/", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
async def create_listing(
    listing: ListingCreate,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Create new IP listing
    Only creators can create listings
    """
    if current_user["role"] != "creator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only creators can create IP listings"
        )

    supabase = get_supabase_client()

    # Prepare listing data
    listing_data = {
        "creator_id": current_user["id"],
        "title": listing.title,
        "tagline": listing.tagline,
        "description": listing.description,
        "genre": listing.genre,
        "format": listing.format,
        "tier": listing.tier,
        "period": listing.period,
        "location": listing.location,
        "world_type": listing.world_type,
        "themes": listing.themes or [],
        "target_audience": listing.target_audience,
        "comparables": listing.comparables or [],
        "logline": listing.logline,
        "rights_holder": listing.rights_holder,
        "rights_holder_contact": listing.rights_holder_contact,
        "available_rights": listing.available_rights or [],
        "available_territories": listing.available_territories or [],
        "status": "draft",  # Always start as draft
        "ai_analysis_status": "pending"
    }

    try:
        response = supabase.table("ip_listings").insert(listing_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create listing: {str(e)}"
        )


@router.get("/featured", response_model=List[ListingResponse])
async def get_featured_listings(limit: int = Query(6, le=12)):
    """Get featured published listings for homepage"""
    supabase = get_supabase_client()
    try:
        response = supabase.table("ip_listings") \
            .select("*") \
            .eq("status", "published") \
            .eq("featured", True) \
            .order("ai_score", desc=True) \
            .limit(limit) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch featured listings: {str(e)}"
        )


@router.get("/by-slug/{slug}", response_model=ListingResponse)
async def get_listing_by_slug(slug: str):
    """Get single IP listing by slug — public, published only"""
    supabase = get_supabase_client()
    try:
        response = supabase.table("ip_listings") \
            .select("*") \
            .eq("slug", slug) \
            .eq("status", "published") \
            .single() \
            .execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
        supabase.table("ip_listings") \
            .update({"view_count": response.data["view_count"] + 1}) \
            .eq("id", response.data["id"]) \
            .execute()
        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch listing: {str(e)}"
        )


@router.get("/", response_model=List[ListingResponse])
async def list_listings(
    genre: Optional[str] = Query(None),
    tier: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query("published"),  # Default to published only
    sort_by: str = Query("created_at", regex="^(created_at|view_count|save_count|title)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0)
):
    """
    List IP listings with filters and pagination
    Public endpoint - returns only published listings by default
    """
    supabase = get_supabase_client()

    # Build query
    query = supabase.table("ip_listings").select("*")

    # Apply filters
    if status:
        query = query.eq("status", status)
    if genre:
        query = query.eq("genre", genre)
    if tier:
        query = query.eq("tier", tier)
    if search:
        # Simple text search (can be improved with full-text search later)
        query = query.or_(f"title.ilike.%{search}%,description.ilike.%{search}%")

    # Apply sorting
    ascending = (order == "asc")
    query = query.order(sort_by, desc=not ascending)

    # Apply pagination
    query = query.range(offset, offset + limit - 1)

    try:
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch listings: {str(e)}"
        )


@router.get("/my-listings", response_model=List[ListingResponse])
async def get_my_listings(
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Get current user's listings
    Returns all statuses (draft, pending, published, archived)
    """
    if current_user["role"] != "creator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only creators have listings"
        )

    supabase = get_supabase_client()

    try:
        response = supabase.table("ip_listings") \
            .select("*") \
            .eq("creator_id", current_user["id"]) \
            .order("created_at", desc=True) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch your listings: {str(e)}"
        )


@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing(listing_id: str):
    """
    Get single IP listing by ID
    Public endpoint - only returns published listings
    """
    supabase = get_supabase_client()

    try:
        response = supabase.table("ip_listings") \
            .select("*") \
            .eq("id", listing_id) \
            .eq("status", "published") \
            .single() \
            .execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found"
            )

        # Increment view count (async, don't wait for response)
        supabase.table("ip_listings") \
            .update({"view_count": response.data["view_count"] + 1}) \
            .eq("id", listing_id) \
            .execute()

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch listing: {str(e)}"
        )


@router.put("/{listing_id}", response_model=ListingResponse)
async def update_listing(
    listing_id: str,
    listing_update: ListingUpdate,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Update IP listing
    Only the creator who owns the listing can update it
    """
    supabase = get_supabase_client()

    # Check ownership
    try:
        existing = supabase.table("ip_listings") \
            .select("creator_id") \
            .eq("id", listing_id) \
            .single() \
            .execute()

        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found"
            )

        if existing.data["creator_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to update this listing"
            )

        # Prepare update data (only include fields that were provided)
        update_data = listing_update.model_dump(exclude_unset=True)

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )

        # Update listing
        response = supabase.table("ip_listings") \
            .update(update_data) \
            .eq("id", listing_id) \
            .execute()

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update listing: {str(e)}"
        )


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    listing_id: str,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Delete IP listing
    Only the creator who owns the listing can delete it
    """
    supabase = get_supabase_client()

    # Check ownership
    try:
        existing = supabase.table("ip_listings") \
            .select("creator_id") \
            .eq("id", listing_id) \
            .single() \
            .execute()

        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found"
            )

        if existing.data["creator_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this listing"
            )

        # Delete listing (CASCADE will delete related files, materials, etc.)
        supabase.table("ip_listings").delete().eq("id", listing_id).execute()

        return None

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete listing: {str(e)}"
        )
