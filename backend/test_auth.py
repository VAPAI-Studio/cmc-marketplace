"""
CMC IP Marketplace - Auth Testing Script
Quick manual test of auth endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"


def print_response(title, response):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")


def test_auth_flow():
    """Test complete auth flow: register → login → get profile"""

    # Test 1: Health check
    print("\n🔍 Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print_response("Health Check", response)

    # Test 2: Register creator
    print("\n👤 Registering new creator...")
    creator_data = {
        "email": "test.creator@cmc.com",
        "password": "TestPassword123!",
        "role": "creator",
        "display_name": "Test Creator"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=creator_data)
    print_response("Register Creator", response)

    if response.status_code == 201:
        creator = response.json()
        creator_id = creator.get("id")
        print(f"\n✅ Creator created with ID: {creator_id}")
    else:
        print("\n❌ Failed to create creator")
        return

    # Test 3: Register buyer
    print("\n👤 Registering new buyer...")
    buyer_data = {
        "email": "test.buyer@cmc.com",
        "password": "TestPassword123!",
        "role": "buyer",
        "display_name": "Test Buyer"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=buyer_data)
    print_response("Register Buyer", response)

    if response.status_code == 201:
        buyer = response.json()
        buyer_id = buyer.get("id")
        print(f"\n✅ Buyer created with ID: {buyer_id}")
    else:
        print("\n❌ Failed to create buyer")
        return

    # Test 4: Register admin
    print("\n👤 Registering new admin...")
    admin_data = {
        "email": "admin@cmc.com",
        "password": "AdminPassword123!",
        "role": "admin",
        "display_name": "Admin User"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=admin_data)
    print_response("Register Admin", response)

    # Test 5: Login as creator
    print("\n🔐 Logging in as creator...")
    login_data = {
        "email": creator_data["email"],
        "password": creator_data["password"]
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print_response("Login Creator", response)

    if response.status_code == 200:
        login_result = response.json()
        access_token = login_result.get("access_token")
        print(f"\n✅ Login successful! Token: {access_token[:50]}...")
    else:
        print("\n❌ Login failed")
        return

    # Test 6: Get creator profile
    print("\n📋 Getting creator profile...")
    response = requests.get(f"{BASE_URL}/api/users/me?user_id={creator_id}")
    print_response("Get Profile", response)

    # Test 7: Update creator profile
    print("\n✏️ Updating creator profile...")
    update_data = {
        "bio": "I'm a test creator for CMC Marketplace",
        "company_name": "Test Productions"
    }
    response = requests.put(f"{BASE_URL}/api/users/me?user_id={creator_id}", json=update_data)
    print_response("Update Profile", response)

    # Test 8: Duplicate email (should fail)
    print("\n🚫 Testing duplicate email...")
    response = requests.post(f"{BASE_URL}/api/auth/register", json=creator_data)
    print_response("Duplicate Registration", response)

    if response.status_code == 409:
        print("\n✅ Correctly rejected duplicate email")
    else:
        print("\n⚠️ Duplicate email handling unexpected")

    # Test 9: Invalid login (should fail)
    print("\n🚫 Testing invalid login...")
    bad_login = {
        "email": "test.creator@cmc.com",
        "password": "WrongPassword!"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=bad_login)
    print_response("Invalid Login", response)

    if response.status_code == 401:
        print("\n✅ Correctly rejected invalid credentials")
    else:
        print("\n⚠️ Invalid login handling unexpected")

    # Test 10: Logout
    print("\n👋 Logging out...")
    response = requests.post(f"{BASE_URL}/api/auth/logout")
    print_response("Logout", response)

    print("\n" + "="*60)
    print("✅ AUTH TESTING COMPLETE!")
    print("="*60)
    print("\nTest users created:")
    print(f"  Creator: {creator_data['email']} / {creator_data['password']}")
    print(f"  Buyer:   {buyer_data['email']} / {buyer_data['password']}")
    print(f"  Admin:   {admin_data['email']} / {admin_data['password']}")


if __name__ == "__main__":
    print("\n🚀 CMC Marketplace - Auth Testing")
    print("="*60)
    print("Make sure backend is running: uvicorn app.main:app --reload")
    print("="*60)

    try:
        test_auth_flow()
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to backend!")
        print("Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
