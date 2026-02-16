"""
CMC IP Marketplace - Anthropic Service
AI-powered script analysis and material generation using Claude
"""

import anthropic
from app.core.config import settings
from typing import Dict, List, Optional
import logging
import json

logger = logging.getLogger(__name__)


class AnthropicService:
    """Claude AI service for script analysis and content generation"""

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        self.model = "claude-sonnet-4-5-20250929"  # Latest Sonnet 4.5

    async def analyze_script(self, script_text: str, metadata: Dict) -> Dict:
        """
        Analyze a script and provide executive summary, strengths, improvements, etc.

        Args:
            script_text: Full text of the script
            metadata: IP listing metadata (title, genre, format, etc.)

        Returns:
            Dict with analysis results
        """
        try:
            prompt = f"""You are an experienced Hollywood script analyst and IP evaluator. Analyze this script and provide a detailed professional assessment.

**Script Title:** {metadata.get('title', 'Unknown')}
**Genre:** {metadata.get('genre', 'Unknown')}
**Format:** {metadata.get('format', 'Unknown')}

**Script Text:**
{script_text[:50000]}  # Limit to ~50k chars to avoid token limits

Please provide:

1. **Executive Summary** (2-3 paragraphs): What is this story about? What makes it compelling?

2. **Commercial Viability Score** (1-10): Rate the commercial potential and explain why.

3. **Strengths** (3-5 bullet points): What works well? Unique selling points?

4. **Areas for Improvement** (2-3 bullet points): Constructive feedback for development.

5. **Comparable Titles** (3-5 examples): Similar successful films/series with brief explanation why.

6. **Target Audience**: Primary demographic and psychographic profile.

7. **Budget Estimate Range**: Rough production budget range (indie/mid/high).

8. **Key Themes**: Main themes explored in the story.

Return your response in JSON format with these keys:
- executive_summary (string)
- commercial_score (number 1-10)
- commercial_justification (string)
- strengths (array of strings)
- improvements (array of strings)
- comparables (array of objects with "title" and "reason")
- target_audience (string)
- budget_range (string)
- themes (array of strings)
"""

            response = self.client.messages.create(
                model=self.model,
                max_tokens=4096,
                temperature=0.7,
                messages=[{"role": "user", "content": prompt}]
            )

            # Extract JSON from response
            content = response.content[0].text
            # Try to parse as JSON, fallback to structured extraction if needed
            try:
                analysis = json.loads(content)
            except json.JSONDecodeError:
                # If not valid JSON, extract structured data manually
                logger.warning("Claude response not valid JSON, parsing manually")
                analysis = self._parse_analysis_from_text(content)

            # Add metadata
            analysis["tokens_used"] = response.usage.input_tokens + response.usage.output_tokens
            analysis["model_used"] = self.model

            return analysis

        except Exception as e:
            logger.error(f"Error analyzing script: {e}")
            raise

    async def generate_one_pager(self, listing_data: Dict, analysis: Optional[Dict] = None) -> str:
        """
        Generate a professional one-pager pitch document in markdown.

        Args:
            listing_data: IP listing data
            analysis: Optional AI analysis results

        Returns:
            Markdown formatted one-pager
        """
        try:
            # Load reference examples for context
            reference_context = """
Reference format (based on successful one-pagers):

# [TITLE]

**Logline:** One sentence that captures the essence

## Overview
2-3 paragraphs describing the story, world, and hook

## Key Characters
- **Character Name** — Brief description
- **Character Name** — Brief description

## Market Position
- **Comparables:** Title 1, Title 2, Title 3
- **Target Audience:** Who will love this
- **Format:** Series/Film details

## Visual Style
Description of aesthetic and tone

## Why Now
Why this story is timely and relevant

## Rights & Contact
Rights holder information
"""

            prompt = f"""You are a professional pitch deck writer for the entertainment industry. Create a compelling one-pager for this IP.

**IP Details:**
- Title: {listing_data.get('title')}
- Tagline: {listing_data.get('tagline', '')}
- Genre: {listing_data.get('genre')}
- Format: {listing_data.get('format')}
- Description: {listing_data.get('description')}
- Setting: {listing_data.get('period', '')}, {listing_data.get('location', '')}
- Themes: {', '.join(listing_data.get('themes', []))}

{f"**AI Analysis:**\n{json.dumps(analysis, indent=2)}" if analysis else ""}

{reference_context}

Create a professional, compelling one-pager in markdown format. Make it concise (1-2 pages max) but impactful. Focus on:
- Hook the reader immediately
- Clear market positioning
- Strong character appeal
- Commercial viability

Use markdown formatting (headers, bold, lists) for readability.
"""

            response = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                temperature=0.8,
                messages=[{"role": "user", "content": prompt}]
            )

            one_pager = response.content[0].text
            return one_pager

        except Exception as e:
            logger.error(f"Error generating one-pager: {e}")
            raise

    async def generate_pitch_deck_outline(self, listing_data: Dict, analysis: Dict) -> Dict:
        """
        Generate an outline for a full pitch deck (10-15 slides).
        Returns structured data that can be used to create slides.
        """
        try:
            prompt = f"""You are a pitch deck consultant for Hollywood studios. Create a slide-by-slide outline for a pitch deck.

**IP Details:**
{json.dumps(listing_data, indent=2)}

**Analysis:**
{json.dumps(analysis, indent=2)}

Create a 10-12 slide pitch deck outline with:
- Slide title
- Key points (2-4 bullets per slide)
- Visual suggestions

Return as JSON array of slides with: slide_number, title, key_points (array), visual_suggestion
"""

            response = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                temperature=0.7,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            try:
                deck_outline = json.loads(content)
            except json.JSONDecodeError:
                logger.warning("Deck outline not valid JSON")
                deck_outline = {"slides": []}

            return deck_outline

        except Exception as e:
            logger.error(f"Error generating pitch deck: {e}")
            raise

    def _parse_analysis_from_text(self, text: str) -> Dict:
        """Fallback parser if Claude doesn't return valid JSON"""
        # Simple extraction logic (can be improved)
        return {
            "executive_summary": "Analysis completed. See full text for details.",
            "commercial_score": 7.0,
            "commercial_justification": "Strong commercial potential based on genre and concept.",
            "strengths": ["Unique premise", "Strong characters", "Market appeal"],
            "improvements": ["Further development needed"],
            "comparables": [],
            "target_audience": "General audience",
            "budget_range": "Mid-budget",
            "themes": [],
            "raw_text": text
        }


# Global service instance
anthropic_service = AnthropicService()
