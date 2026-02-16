# CMC Marketplace - Testing Guide

## Running the Backend

1. **Activate virtual environment**
   ```bash
   cd backend
   source venv/bin/activate
   ```

2. **Start the server**
   ```bash
   uvicorn app.main:app --reload
   ```

   Server will be available at: http://localhost:8000

3. **Check API docs**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

---

## Testing Auth Endpoints

### Option 1: Automated Test Script

Run the test script to create test users and verify all auth flows:

```bash
python test_auth.py
```

This will:
- ✅ Create 3 test users (creator, buyer, admin)
- ✅ Test register, login, logout flows
- ✅ Test profile retrieval and updates
- ✅ Test error handling (duplicate emails, invalid credentials)

### Option 2: Manual Testing (Swagger UI)

1. Go to http://localhost:8000/docs

2. **Register a user**
   - Endpoint: `POST /api/auth/register`
   - Click "Try it out"
   - Enter:
     ```json
     {
       "email": "creator@test.com",
       "password": "TestPass123!",
       "role": "creator",
       "display_name": "Test Creator"
     }
     ```
   - Click "Execute"
   - Should return 201 with user profile

3. **Login**
   - Endpoint: `POST /api/auth/login`
   - Enter:
     ```json
     {
       "email": "creator@test.com",
       "password": "TestPass123!"
     }
     ```
   - Copy the `access_token` from response

4. **Get profile**
   - Endpoint: `GET /api/users/me`
   - Add query param: `user_id={id from register response}`
   - Should return user profile

### Option 3: cURL Commands

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@cmc.com",
    "password": "TestPass123!",
    "role": "creator",
    "display_name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@cmc.com",
    "password": "TestPass123!"
  }'
```

---

## Verifying Database

### Check Supabase Table Editor

1. Go to your Supabase project dashboard
2. Click "Table Editor" in sidebar
3. Open "users" table
4. You should see test users created with:
   - id (UUID)
   - email
   - role (creator/buyer/admin)
   - display_name
   - created_at, updated_at

### Check Supabase Auth

1. Go to "Authentication" → "Users" in Supabase
2. You should see users created via register endpoint
3. Email confirmation status (if enabled)

---

## Testing RLS Policies

### Creator can only see their own IPs

1. Register 2 creators
2. Create IP as Creator A (when we build that endpoint)
3. Try to fetch as Creator B → should not see Creator A's IPs

### Buyers can see published IPs

1. Register as buyer
2. Fetch IPs with status=published → should see them
3. Try to fetch IPs with status=draft → should NOT see them

---

## Common Issues

### Error: "Connection refused"
→ Make sure backend is running and `.env` has correct Supabase credentials

### Error: "User already exists"
→ Delete user from Supabase Auth dashboard or use different email

### Error: "Invalid API key"
→ Check `.env` has correct `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_KEY`

### Error: "Module not found"
→ Make sure you activated venv: `source venv/bin/activate`

---

## Test Users (if using test_auth.py)

After running the test script, these users exist:

| Role    | Email                  | Password          |
|---------|------------------------|-------------------|
| Creator | test.creator@cmc.com   | TestPassword123!  |
| Buyer   | test.buyer@cmc.com     | TestPassword123!  |
| Admin   | admin@cmc.com          | AdminPassword123! |

Use these for manual testing in frontend later.

---

## Next Steps

Once auth is verified:
- ✅ Users can register with role
- ✅ Users can login and get token
- ✅ Users can view/update profile
- ✅ RLS policies prevent unauthorized access

**Proceed to Week 3:** Design system & frontend setup
