"""
AI Analysis API Endpoints
Script analysis and one-pager generation using Claude
"""
import json
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from pydantic import BaseModel

from app.core.security import get_current_user
from app.services.supabase_service import get_supabase_client
from app.services.anthropic_service import anthropic_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["ai"])


# ==========================================
# Response Models
# ==========================================

class AnalysisResponse(BaseModel):
    listing_id: str
    status: str
    analysis: Optional[dict] = None
    message: str


class OnePagerResponse(BaseModel):
    listing_id: str
    one_pager: str
    message: str


# ==========================================
# Helpers
# ==========================================

def _get_listing_text(listing: dict) -> str:
    """Build a rich text representation of the listing for Claude to analyze."""
    parts = []
    parts.append(f"Title: {listing.get('title', '')}")
    if listing.get('tagline'):
        parts.append(f"Tagline: {listing['tagline']}")
    parts.append(f"Genre: {listing.get('genre', '')}")
    parts.append(f"Format: {listing.get('format', '')}")
    if listing.get('logline'):
        parts.append(f"Logline: {listing['logline']}")
    if listing.get('description'):
        parts.append(f"\nDescription:\n{listing['description']}")
    if listing.get('period'):
        parts.append(f"Time Period: {listing['period']}")
    if listing.get('location'):
        parts.append(f"Location: {listing['location']}")
    if listing.get('world_type'):
        parts.append(f"World Type: {listing['world_type']}")
    if listing.get('themes'):
        parts.append(f"Themes: {', '.join(listing['themes'])}")
    if listing.get('target_audience'):
        parts.append(f"Target Audience: {listing['target_audience']}")
    if listing.get('comparables'):
        parts.append(f"Comparables: {', '.join(listing['comparables'])}")
    return '\n'.join(parts)


async def _fetch_script_text(listing: dict, supabase) -> Optional[str]:
    """Try to download and read the script PDF from Supabase Storage."""
    script_url = listing.get('script_url')
    if not script_url:
        return None

    try:
        import httpx
        import pypdf
        import io

        async with httpx.AsyncClient() as client:
            response = await client.get(script_url, follow_redirects=True, timeout=30)
            if response.status_code != 200:
                logger.warning(f"Could not download script: {response.status_code}")
                return None

        # Parse PDF
        pdf_reader = pypdf.PdfReader(io.BytesIO(response.content))
        text_parts = []
        for page in pdf_reader.pages:
            text_parts.append(page.extract_text() or '')
        return '\n'.join(text_parts)[:60000]  # Cap at 60k chars

    except Exception as e:
        logger.warning(f"Could not read script PDF: {e}")
        return None


async def _run_analysis(listing_id: str, supabase):
    """Background task: run AI analysis and save results."""
    try:
        # 1. Get listing
        result = supabase.table("ip_listings").select("*").eq("id", listing_id).single().execute()
        if not result.data:
            logger.error(f"Listing {listing_id} not found for analysis")
            return
        listing = result.data

        # 2. Update status to analyzing
        supabase.table("ip_listings").update({
            "ai_analysis_status": "analyzing"
        }).eq("id", listing_id).execute()

        # 3. Try to get script text, fallback to metadata text
        script_text = await _fetch_script_text(listing, supabase)
        if script_text:
            logger.info(f"[{listing_id}] Using script PDF for analysis ({len(script_text)} chars)")
        else:
            script_text = _get_listing_text(listing)
            logger.info(f"[{listing_id}] No script PDF — using metadata for analysis")

        # 4. Run Claude analysis
        analysis = await anthropic_service.analyze_script(script_text, listing)
        logger.info(f"[{listing_id}] Analysis complete. Score: {analysis.get('commercial_score')}")

        # 5. Save analysis to ip_materials table
        supabase.table("ip_materials").insert({
            "listing_id": listing_id,
            "type": "analysis",
            "content": json.dumps(analysis),
        }).execute()

        # 6. Update listing with key AI fields + status → ready
        supabase.table("ip_listings").update({
            "ai_analysis_status": "ready",
            "ai_score": analysis.get("commercial_score"),
            "ai_strengths": analysis.get("strengths", []),
            "ai_improvements": analysis.get("improvements", []),
        }).eq("id", listing_id).execute()

        logger.info(f"[{listing_id}] Analysis saved successfully")

    except Exception as e:
        logger.error(f"[{listing_id}] Analysis failed: {e}")
        supabase.table("ip_listings").update({
            "ai_analysis_status": "failed"
        }).eq("id", listing_id).execute()


# ==========================================
# Endpoints
# ==========================================

@router.post("/listings/{listing_id}/analyze", response_model=AnalysisResponse)
async def analyze_listing(
    listing_id: str,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """
    Trigger AI analysis for a listing.
    Runs in background — poll the listing status to know when done.
    """
    # Verify listing exists and belongs to user
    result = supabase.table("ip_listings").select("id, creator_id, ai_analysis_status, title").eq("id", listing_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Listing not found")

    listing = result.data
    if listing["creator_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # Don't re-analyze if already in progress
    if listing["ai_analysis_status"] == "analyzing":
        return AnalysisResponse(
            listing_id=listing_id,
            status="analyzing",
            message="Analysis already in progress"
        )

    # Queue background task
    background_tasks.add_task(_run_analysis, listing_id, supabase)

    return AnalysisResponse(
        listing_id=listing_id,
        status="analyzing",
        message=f"Analysis started for '{listing['title']}'. This takes 30-60 seconds."
    )


@router.get("/listings/{listing_id}/analysis", response_model=AnalysisResponse)
async def get_analysis(
    listing_id: str,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """Get the latest AI analysis for a listing."""
    # Get listing status
    listing_result = supabase.table("ip_listings").select(
        "id, creator_id, ai_analysis_status, ai_score, ai_strengths, ai_improvements"
    ).eq("id", listing_id).single().execute()

    if not listing_result.data:
        raise HTTPException(status_code=404, detail="Listing not found")

    listing = listing_result.data

    # Get full analysis from ip_materials
    materials_result = supabase.table("ip_materials").select("content, generated_at").eq(
        "listing_id", listing_id
    ).eq("type", "analysis").order("generated_at", desc=True).limit(1).execute()

    analysis = None
    if materials_result.data:
        try:
            analysis = json.loads(materials_result.data[0]["content"])
        except Exception:
            pass

    return AnalysisResponse(
        listing_id=listing_id,
        status=listing["ai_analysis_status"],
        analysis=analysis,
        message=f"Status: {listing['ai_analysis_status']}"
    )


@router.get("/listings/{listing_id}/onepager", response_model=OnePagerResponse)
async def get_one_pager(
    listing_id: str,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """Get existing one-pager for a listing."""
    result = supabase.table("ip_materials").select("content").eq(
        "listing_id", listing_id
    ).eq("type", "one_pager").order("generated_at", desc=True).limit(1).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="No one-pager found")

    return OnePagerResponse(
        listing_id=listing_id,
        one_pager=result.data[0]["content"],
        message="One-pager retrieved successfully"
    )


@router.post("/listings/{listing_id}/generate-onepager", response_model=OnePagerResponse)
async def generate_one_pager(
    listing_id: str,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase_client),
):
    """Generate a professional one-pager pitch document."""
    # Get listing
    result = supabase.table("ip_listings").select("*").eq("id", listing_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Listing not found")

    listing = result.data
    if listing["creator_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # Get existing analysis if available
    analysis = None
    materials_result = supabase.table("ip_materials").select("content").eq(
        "listing_id", listing_id
    ).eq("type", "analysis").order("generated_at", desc=True).limit(1).execute()

    if materials_result.data:
        try:
            analysis = json.loads(materials_result.data[0]["content"])
        except Exception:
            pass

    # Generate one-pager
    one_pager = await anthropic_service.generate_one_pager(listing, analysis)

    # Save to ip_materials
    supabase.table("ip_materials").insert({
        "listing_id": listing_id,
        "type": "one_pager",
        "content": one_pager,
    }).execute()

    return OnePagerResponse(
        listing_id=listing_id,
        one_pager=one_pager,
        message="One-pager generated successfully"
    )
