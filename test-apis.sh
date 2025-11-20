#!/bin/bash

# EduPro+ API Testing Script
# This script tests all backend APIs and generates documentation

BASE_URL="http://localhost:5001"
API_BASE="${BASE_URL}/api/v1"
OUTPUT_FILE="API_DOCUMENTATION.md"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables to store tokens
ACCESS_TOKEN=""
REFRESH_TOKEN=""
USER_ID=""

echo "=========================================="
echo "EduPro+ API Testing & Documentation"
echo "=========================================="
echo ""

# Check if server is running
echo -n "Checking server status... "
if curl -s "${BASE_URL}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server is running${NC}"
else
    echo -e "${RED}✗ Server is not running. Please start the server first.${NC}"
    echo "Run: cd backend && npm run dev"
    exit 1
fi

# Initialize documentation file
cat > "$OUTPUT_FILE" << 'EOF'
# EduPro+ API Documentation

**Base URL:** `http://localhost:5001/api/v1`

**Generated:** $(date)

---

## Table of Contents

1. [Health Check](#health-check)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Course Management](#course-management)
5. [Enrollment](#enrollment)
6. [Live Classes](#live-classes)
7. [Tests](#tests)
8. [Payments](#payments)
9. [Dashboard](#dashboard)
10. [Analytics](#analytics)
11. [Notifications](#notifications)
12. [AI Services](#ai-services)

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

EOF

# Function to test API and append to documentation
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    local auth=$5
    
    echo ""
    echo -e "${BLUE}Testing:${NC} $method $endpoint"
    
    # Build curl command
    local curl_cmd="curl -s -X $method"
    
    if [ "$auth" = "true" ] && [ -n "$ACCESS_TOKEN" ]; then
        curl_cmd="$curl_cmd -H 'Authorization: Bearer $ACCESS_TOKEN'"
    fi
    
    if [ -n "$data" ]; then
        curl_cmd="$curl_cmd -H 'Content-Type: application/json' -d '$data'"
    fi
    
    curl_cmd="$curl_cmd ${API_BASE}${endpoint}"
    
    # Execute request
    response=$(eval $curl_cmd)
    status=$?
    
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}✓ Success${NC}"
        
        # Append to documentation
        cat >> "$OUTPUT_FILE" << EOF

### $description

**Endpoint:** \`$method $endpoint\`

**Request:**
\`\`\`bash
curl -X $method \\
  ${API_BASE}${endpoint} \\
$([ "$auth" = "true" ] && echo "  -H 'Authorization: Bearer <access_token>' \\")
$([ -n "$data" ] && echo "  -H 'Content-Type: application/json' \\
  -d '$data'")
\`\`\`

**Response:**
\`\`\`json
$(echo "$response" | jq '.' 2>/dev/null || echo "$response")
\`\`\`

---

EOF
    else
        echo -e "${RED}✗ Failed${NC}"
    fi
    
    echo "$response"
}

# ==========================================
# 1. HEALTH CHECK
# ==========================================

echo ""
echo "=========================================="
echo "1. Testing Health Check"
echo "=========================================="

cat >> "$OUTPUT_FILE" << 'EOF'

## Health Check

Check the status of all services (Database, Redis, MongoDB).

EOF

response=$(curl -s "${BASE_URL}/health")
echo "$response" | jq '.' 2>/dev/null

cat >> "$OUTPUT_FILE" << EOF

### Health Status

**Endpoint:** \`GET /health\`

**Request:**
\`\`\`bash
curl -X GET ${BASE_URL}/health
\`\`\`

**Response:**
\`\`\`json
$(echo "$response" | jq '.')
\`\`\`

---

EOF

# ==========================================
# 2. AUTHENTICATION
# ==========================================

echo ""
echo "=========================================="
echo "2. Testing Authentication APIs"
echo "=========================================="

cat >> "$OUTPUT_FILE" << 'EOF'

## Authentication

Authentication endpoints for user registration, login, and password management.

EOF

# Register new user
echo ""
echo -e "${BLUE}Testing: POST /auth/register${NC}"
REGISTER_DATA='{
  "email": "test.student@example.com",
  "password": "Test@1234",
  "firstName": "Test",
  "lastName": "Student",
  "phone": "+919876543210",
  "role": "STUDENT"
}'

register_response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$REGISTER_DATA" \
  "${API_BASE}/auth/register")

echo "$register_response" | jq '.' 2>/dev/null

cat >> "$OUTPUT_FILE" << EOF

### Register New User

**Endpoint:** \`POST /auth/register\`

**Request:**
\`\`\`bash
curl -X POST \\
  ${API_BASE}/auth/register \\
  -H 'Content-Type: application/json' \\
  -d '$REGISTER_DATA'
\`\`\`

**Response:**
\`\`\`json
$(echo "$register_response" | jq '.')
\`\`\`

**Roles:** STUDENT, TEACHER, PARENT, ADMIN

---

EOF

# Login
echo ""
echo -e "${BLUE}Testing: POST /auth/login${NC}"
LOGIN_DATA='{
  "email": "test.student@example.com",
  "password": "Test@1234"
}'

login_response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA" \
  "${API_BASE}/auth/login")

echo "$login_response" | jq '.' 2>/dev/null

# Extract tokens
ACCESS_TOKEN=$(echo "$login_response" | jq -r '.data.accessToken // empty')
REFRESH_TOKEN=$(echo "$login_response" | jq -r '.data.refreshToken // empty')
USER_ID=$(echo "$login_response" | jq -r '.data.user.id // empty')

if [ -n "$ACCESS_TOKEN" ]; then
    echo -e "${GREEN}✓ Login successful. Token saved.${NC}"
else
    echo -e "${RED}✗ Login failed or user already exists. Trying to login with existing user...${NC}"
    
    # Try with a different email or existing user
    LOGIN_DATA='{
      "email": "test.student@example.com",
      "password": "Test@1234"
    }'
    
    login_response=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "$LOGIN_DATA" \
      "${API_BASE}/auth/login")
    
    ACCESS_TOKEN=$(echo "$login_response" | jq -r '.data.accessToken // empty')
    REFRESH_TOKEN=$(echo "$login_response" | jq -r '.data.refreshToken // empty')
    USER_ID=$(echo "$login_response" | jq -r '.data.user.id // empty')
fi

cat >> "$OUTPUT_FILE" << EOF

### Login

**Endpoint:** \`POST /auth/login\`

**Request:**
\`\`\`bash
curl -X POST \\
  ${API_BASE}/auth/login \\
  -H 'Content-Type: application/json' \\
  -d '$LOGIN_DATA'
\`\`\`

**Response:**
\`\`\`json
$(echo "$login_response" | jq '.')
\`\`\`

---

EOF

# Get Current User
echo ""
echo -e "${BLUE}Testing: GET /auth/me${NC}"
if [ -n "$ACCESS_TOKEN" ]; then
    me_response=$(curl -s -X GET \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      "${API_BASE}/auth/me")
    
    echo "$me_response" | jq '.' 2>/dev/null
    
    cat >> "$OUTPUT_FILE" << EOF

### Get Current User

**Endpoint:** \`GET /auth/me\`

**Authentication:** Required

**Request:**
\`\`\`bash
curl -X GET \\
  ${API_BASE}/auth/me \\
  -H 'Authorization: Bearer <access_token>'
\`\`\`

**Response:**
\`\`\`json
$(echo "$me_response" | jq '.')
\`\`\`

---

EOF
else
    echo -e "${RED}✗ Skipping authenticated endpoints (no token)${NC}"
fi

# Refresh Token
if [ -n "$REFRESH_TOKEN" ]; then
    echo ""
    echo -e "${BLUE}Testing: POST /auth/refresh-token${NC}"
    REFRESH_DATA="{\"refreshToken\": \"$REFRESH_TOKEN\"}"
    
    refresh_response=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "$REFRESH_DATA" \
      "${API_BASE}/auth/refresh-token")
    
    echo "$refresh_response" | jq '.' 2>/dev/null
    
    cat >> "$OUTPUT_FILE" << EOF

### Refresh Token

**Endpoint:** \`POST /auth/refresh-token\`

**Request:**
\`\`\`bash
curl -X POST \\
  ${API_BASE}/auth/refresh-token \\
  -H 'Content-Type: application/json' \\
  -d '{"refreshToken": "<refresh_token>"}'
\`\`\`

**Response:**
\`\`\`json
$(echo "$refresh_response" | jq '.')
\`\`\`

---

EOF
fi

# Forgot Password
echo ""
echo -e "${BLUE}Testing: POST /auth/forgot-password${NC}"
FORGOT_DATA='{
  "email": "test.student@example.com"
}'

forgot_response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$FORGOT_DATA" \
  "${API_BASE}/auth/forgot-password")

echo "$forgot_response" | jq '.' 2>/dev/null

cat >> "$OUTPUT_FILE" << EOF

### Forgot Password

**Endpoint:** \`POST /auth/forgot-password\`

**Request:**
\`\`\`bash
curl -X POST \\
  ${API_BASE}/auth/forgot-password \\
  -H 'Content-Type: application/json' \\
  -d '$FORGOT_DATA'
\`\`\`

**Response:**
\`\`\`json
$(echo "$forgot_response" | jq '.')
\`\`\`

---

EOF

# ==========================================
# 3. USER MANAGEMENT
# ==========================================

echo ""
echo "=========================================="
echo "3. Testing User Management APIs"
echo "=========================================="

cat >> "$OUTPUT_FILE" << 'EOF'

## User Management

Endpoints for managing user profiles and information.

EOF

# Get Users (Admin only, will likely fail without proper permissions)
echo ""
echo -e "${BLUE}Testing: GET /users${NC}"
if [ -n "$ACCESS_TOKEN" ]; then
    users_response=$(curl -s -X GET \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      "${API_BASE}/users")
    
    echo "$users_response" | jq '.' 2>/dev/null
    
    cat >> "$OUTPUT_FILE" << EOF

### Get All Users

**Endpoint:** \`GET /users\`

**Authentication:** Required (Admin only)

**Request:**
\`\`\`bash
curl -X GET \\
  ${API_BASE}/users \\
  -H 'Authorization: Bearer <access_token>'
\`\`\`

**Response:**
\`\`\`json
$(echo "$users_response" | jq '.')
\`\`\`

---

EOF
fi

# ==========================================
# 4. COURSE MANAGEMENT
# ==========================================

echo ""
echo "=========================================="
echo "4. Testing Course APIs"
echo "=========================================="

cat >> "$OUTPUT_FILE" << 'EOF'

## Course Management

Endpoints for managing courses, sections, and lessons.

EOF

echo ""
echo -e "${BLUE}Testing: GET /courses${NC}"
courses_response=$(curl -s -X GET "${API_BASE}/courses")

echo "$courses_response" | jq '.' 2>/dev/null

cat >> "$OUTPUT_FILE" << EOF

### Get All Courses

**Endpoint:** \`GET /courses\`

**Request:**
\`\`\`bash
curl -X GET ${API_BASE}/courses
\`\`\`

**Response:**
\`\`\`json
$(echo "$courses_response" | jq '.')
\`\`\`

---

EOF

# ==========================================
# 5. OTHER MODULES
# ==========================================

# Test other module endpoints
for module in "enrollments" "live-classes" "tests" "payments" "dashboard" "analytics" "notifications" "ai"; do
    echo ""
    echo "=========================================="
    echo "Testing /${module}"
    echo "=========================================="
    
    module_response=$(curl -s -X GET "${API_BASE}/${module}")
    echo "$module_response" | jq '.' 2>/dev/null
    
    # Capitalize module name for documentation
    module_title=$(echo "$module" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
    
    cat >> "$OUTPUT_FILE" << EOF

## ${module_title}

**Endpoint:** \`GET /${module}\`

**Request:**
\`\`\`bash
curl -X GET ${API_BASE}/${module}
\`\`\`

**Response:**
\`\`\`json
$(echo "$module_response" | jq '.')
\`\`\`

---

EOF
done

# ==========================================
# LOGOUT
# ==========================================

if [ -n "$ACCESS_TOKEN" ]; then
    echo ""
    echo "=========================================="
    echo "Testing Logout"
    echo "=========================================="
    
    echo -e "${BLUE}Testing: POST /auth/logout${NC}"
    logout_response=$(curl -s -X POST \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      "${API_BASE}/auth/logout")
    
    echo "$logout_response" | jq '.' 2>/dev/null
    
    cat >> "$OUTPUT_FILE" << EOF

### Logout

**Endpoint:** \`POST /auth/logout\`

**Authentication:** Required

**Request:**
\`\`\`bash
curl -X POST \\
  ${API_BASE}/auth/logout \\
  -H 'Authorization: Bearer <access_token>'
\`\`\`

**Response:**
\`\`\`json
$(echo "$logout_response" | jq '.')
\`\`\`

---

EOF
fi

# ==========================================
# COMPLETION
# ==========================================

cat >> "$OUTPUT_FILE" << 'EOF'

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., user already exists)
- `422` - Validation Error
- `500` - Internal Server Error

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Window:** 15 minutes
- **Max Requests:** 100 per window

When rate limit is exceeded:

```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

---

## Notes

- All timestamps are in ISO 8601 format
- Dates are stored in UTC
- Pagination is supported on list endpoints with `page` and `limit` query parameters
- File uploads use `multipart/form-data`
- Maximum request body size: 10MB

---

**Documentation generated on:** $(date)

EOF

echo ""
echo "=========================================="
echo -e "${GREEN}✓ API Testing Complete!${NC}"
echo "=========================================="
echo ""
echo "Documentation saved to: $OUTPUT_FILE"
echo ""
