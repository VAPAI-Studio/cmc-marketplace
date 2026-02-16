# CMC Backend - Quick Start

## First Time Setup

```bash
# 1. Navigate to backend
cd /Users/yvesfogel/Documents/Projects/cmc-marketplace/backend

# 2. Create virtual environment (if not exists)
python3 -m venv venv

# 3. Activate it
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Copy environment template
cp .env.example .env

# 6. Edit .env with your credentials
nano .env  # or use your editor

# Required variables:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_KEY
# - ANTHROPIC_API_KEY
# - SECRET_KEY (generate with: openssl rand -hex 32)
```

## Every Time You Work

```bash
# Navigate to backend
cd /Users/yvesfogel/Documents/Projects/cmc-marketplace/backend

# Activate venv
source venv/bin/activate

# Run server
uvicorn app.main:app --reload

# Server runs on: http://localhost:8000
```

## Testing

```bash
# Run auth tests (make sure server is running first)
python test_auth.py
```

## Stop Server

Press `Ctrl+C` in the terminal where server is running

## Deactivate venv

```bash
deactivate
```

---

## Checklist

Before running for first time:
- [ ] Supabase project created
- [ ] Database schema executed in Supabase
- [ ] Storage bucket "ip-materials" created
- [ ] `.env` file created and filled with credentials
- [ ] Virtual environment created and activated
- [ ] Dependencies installed

If all checked ✅ → `uvicorn app.main:app --reload`
