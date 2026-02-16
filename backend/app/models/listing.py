"""
CMC IP Marketplace - Listing Models
Pydantic models for IP listing data validation
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class IPTier(str, Enum):
    """IP tier classification"""
    FLAGSHIP = "flagship"
    STRONG = "strong"
    HIDDEN_GEM = "hidden-gem"


class IPStatus(str, Enum):
    """IP listing status"""
    DRAFT = "draft"
    PENDING = "pending"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class AIAnalysisStatus(str, Enum):
    """AI analysis status"""
    PENDING = "pending"
    ANALYZING = "analyzing"
    READY = "ready"
    FAILED = "failed"


class ListingCreate(BaseModel):
    """Create new IP listing"""
    title: str = Field(..., min_length=2, max_length=200)
    tagline: Optional[str] = Field(None, max_length=300)
    description: str = Field(..., min_length=50)

    genre: str
    format: str

    period: Optional[str] = None
    location: Optional[str] = None
    world_type: Optional[str] = None
    themes: Optional[List[str]] = []
    target_audience: Optional[str] = None

    comparables: Optional[List[str]] = []
    logline: Optional[str] = None

    rights_holder: Optional[str] = None
    rights_holder_contact: Optional[str] = None
    available_rights: Optional[List[str]] = []
    available_territories: Optional[List[str]] = []


class ListingUpdate(BaseModel):
    """Update IP listing"""
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    tagline: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = Field(None, min_length=50)

    genre: Optional[str] = None
    format: Optional[str] = None
    tier: Optional[IPTier] = None

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

    status: Optional[IPStatus] = None
    featured: Optional[bool] = None


class ListingResponse(BaseModel):
    """Full IP listing response"""
    id: str
    creator_id: str
    slug: Optional[str]

    title: str
    tagline: Optional[str]
    description: str

    genre: str
    format: str
    tier: IPTier

    period: Optional[str]
    location: Optional[str]
    world_type: Optional[str]
    themes: Optional[List[str]]
    target_audience: Optional[str]

    comparables: Optional[List[str]]
    logline: Optional[str]

    rights_holder: Optional[str]
    rights_holder_contact: Optional[str]
    available_rights: Optional[List[str]]
    available_territories: Optional[List[str]]

    script_url: Optional[str]
    synopsis_url: Optional[str]
    poster_url: Optional[str]
    concept_art_urls: Optional[List[str]]

    ai_analysis_status: AIAnalysisStatus
    ai_score: Optional[float]
    ai_strengths: Optional[List[str]]
    ai_improvements: Optional[List[str]]

    status: IPStatus
    featured: bool

    view_count: int
    save_count: int
    inquiry_count: int

    created_at: datetime
    updated_at: datetime


class ListingListResponse(BaseModel):
    """Paginated list of listings"""
    listings: List[ListingResponse]
    total: int
    page: int
    limit: int


class IPMaterialType(str, Enum):
    """Types of IP materials"""
    ANALYSIS = "analysis"
    ONE_PAGER = "one_pager"
    PITCH_DECK = "pitch_deck"
    MOOD_BOARD = "mood_board"


class IPMaterial(BaseModel):
    """AI-generated IP material"""
    id: str
    listing_id: str
    type: IPMaterialType
    content: dict
    markdown_content: Optional[str]
    pdf_url: Optional[str]
    generated_at: datetime
    model_used: Optional[str]
    tokens_used: Optional[int]
    cost_usd: Optional[float]
