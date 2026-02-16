# CMC IP Marketplace

> AI-powered marketplace connecting LATAM content creators with global buyers

## Overview

CMC (Content Media Company) is a marketplace platform that helps creators of intellectual property (scripts, concepts, series) connect with buyers (Netflix, Amazon Studios, production companies).

**Key Features:**
- 🎬 Submit scripts and get AI-powered analysis
- 📄 Auto-generate professional pitch materials (one-pagers, pitch decks)
- 🔍 Searchable library of curated IPs
- 💬 Direct buyer-creator messaging
- 🎨 Mood boards and visual materials

## Tech Stack

**Backend:**
- FastAPI (Python 3.11+)
- Supabase (PostgreSQL + Auth + Storage)
- Anthropic Claude Sonnet 4.5 (AI analysis)

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Router

## Project Structure

```
cmc-marketplace/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Config & security
│   │   ├── models/       # Pydantic models
│   │   └── services/     # External services
│   ├── requirements.txt
│   └── schema.sql        # Database schema
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── services/
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Supabase account
- Anthropic API key

### Backend Setup

1. **Create Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project: "cmc-marketplace"
   - Note your project URL and API keys

2. **Run database schema**
   - Open Supabase SQL Editor
   - Copy/paste contents of `backend/schema.sql`
   - Execute

3. **Create Storage bucket**
   - In Supabase Dashboard → Storage
   - Create bucket: "ip-materials"
   - Set to private (use signed URLs)

4. **Install Python dependencies**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

6. **Run backend**
   ```bash
   uvicorn app.main:app --reload
   # API will be available at http://localhost:8000
   ```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App will be available at http://localhost:5173
```

## Development Roadmap

**Phase 1: Foundation (Weeks 1-4)** ✅ In Progress
- [x] Backend setup (FastAPI, Supabase)
- [x] Database schema
- [x] Core services (Supabase, Anthropic)
- [ ] Auth implementation
- [ ] Design system
- [ ] Base pages

**Phase 2: Core Features (Weeks 5-8)**
- [ ] Submit project flow
- [ ] AI analysis pipeline
- [ ] Library with filters
- [ ] IP detail pages

**Phase 3: Dashboards (Weeks 9-12)**
- [ ] Creator dashboard
- [ ] Buyer dashboard
- [ ] Inquiry system
- [ ] Admin panel

**Phase 4: Launch (Weeks 13-16)**
- [ ] Content migration (Robin Wood catalog)
- [ ] Testing & bug fixes
- [ ] Deployment
- [ ] Soft launch

## API Documentation

Once backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Contributing

This is a private project. For questions contact: yves@contentmediacompany.com

## License

Proprietary - All rights reserved

---

**Version:** 0.1.0 (MVP Development)
**Last Updated:** February 2026
