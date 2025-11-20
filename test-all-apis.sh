#!/bin/bash

# EduPro+ API Testing with cURL
# This script tests all backend endpoints and generates a test report

BASE_URL="http://localhost:5001"
API_BASE="${BASE_URL}/api/v1"
TEST_REPORT="API_TEST_REPORT.md"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Variables for auth
ACCESS_TOKEN=""
REFRESH_TOKEN=""
USER_EMAIL=""

# Initialize report
cat > "$TEST_REPORT" << EOF
# EduPro+ API Test Report

**Test Date:** ${TIMESTAMP}  
**Base URL:** ${BASE_URL}  
**API Version:** v1

---

## Test Summary

EOF

echo "=========================================="
echo "EduPro+ API Testing Suite"
echo "=========================================="
echo ""

# Function to test API
test_api() {
    local test_name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    local auth=$6
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo ""
    echo -e "${BLUE}Test #${TOTAL_TESTS}: ${test_name}${NC}"
    echo "Endpoint: ${method} ${endpoint}"
    
    # Build curl command
    local curl_cmd="curl -s -w '\n%{http_code}' -X ${method}"
    
    if [ "$auth" = "true" ] && [ -n "$ACCESS_TOKEN" ]; then
        curl_cmd="${curl_cmd} -H 'Authorization: Bearer ${ACCESS_TOKEN}'"
    fi
    
    if [ -n "$data" ]; then
        curl_cmd="${curl_cmd} -H 'Content-Type: application/json' -d '${data}'"
    fi
    
    curl_cmd="${curl_cmd} ${API_BASE}${endpoint}"
    
    # Execute request
    response=$(eval ${curl_cmd})
    
    # Extract status code (last line) and body (everything else)
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Check if status matches expected
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: ${status_code})"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        test_result="✅ PASSED"
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: ${expected_status}, Got: ${status_code})"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        test_result="❌ FAILED"
    fi
    
    # Pretty print JSON if possible
    formatted_body=$(echo "$body" | jq '.' 2>/dev/null || echo "$body")
    
    echo "Response:"
    echo "$formatted_body" | head -20
    
    # Append to report
    cat >> "$TEST_REPORT" << EOF

### ${TOTAL_TESTS}. ${test_name}

**Result:** ${test_result}  
**Expected Status:** ${expected_status}  
**Actual Status:** ${status_code}

**Request:**
\`\`\`bash
curl -X ${method} \\
  ${API_BASE}${endpoint}$([ "$auth" = "true" ] && echo " \\" && echo "  -H 'Authorization: Bearer <token>'")$([ -n "$data" ] && echo " \\" && echo "  -H 'Content-Type: application/json' \\" && echo "  -d '${data}'")
\`\`\`

**Response:**
\`\`\`json
${formatted_body}
\`\`\`

---

EOF
    
    # Return the body for further processing
    echo "$body"
}

# ==========================================
# CHECK SERVER STATUS
# ==========================================

echo ""
echo "Checking if server is running..."

server_check=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/health" 2>/dev/null)

if [ "$server_check" != "200" ]; then
    echo -e "${RED}✗ Server is not running on port 5001${NC}"
    echo ""
    echo "Please start the server first:"
    echo "  cd backend && npm run dev"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Server is running${NC}"

# ==========================================
# TEST 1: HEALTH CHECK
# ==========================================

echo ""
echo "=========================================="
echo "Health & Infrastructure Tests"
echo "=========================================="

test_api "Health Check" "GET" "/health" "" "200" "false" > /dev/null

# ==========================================
# TEST 2-12: AUTHENTICATION
# ==========================================

echo ""
echo "=========================================="
echo "Authentication Tests"
echo "=========================================="

# Generate unique email for testing
USER_EMAIL="testuser$(date +%s)@example.com"

# Test 2: Register new user
register_data='{
  "email": "'${USER_EMAIL}'",
  "password": "TestPass@123",
  "firstName": "Test",
  "lastName": "User",
  "phone": "+919876543210",
  "role": "STUDENT"
}'

register_response=$(test_api "User Registration" "POST" "/auth/register" "$register_data" "201" "false")

# Extract tokens from response
ACCESS_TOKEN=$(echo "$register_response" | jq -r '.data.accessToken // empty' 2>/dev/null)
REFRESH_TOKEN=$(echo "$register_response" | jq -r '.data.refreshToken // empty' 2>/dev/null)

if [ -n "$ACCESS_TOKEN" ]; then
    echo -e "${GREEN}✓ Access token obtained${NC}"
fi

# Test 3: Login with same user
login_data='{
  "email": "'${USER_EMAIL}'",
  "password": "TestPass@123"
}'

test_api "User Login" "POST" "/auth/login" "$login_data" "200" "false" > /dev/null

# Test 4: Get current user (requires auth)
test_api "Get Current User" "GET" "/auth/me" "" "200" "true" > /dev/null

# Test 5: Refresh token
if [ -n "$REFRESH_TOKEN" ]; then
    refresh_data='{"refreshToken": "'${REFRESH_TOKEN}'"}'
    test_api "Refresh Access Token" "POST" "/auth/refresh-token" "$refresh_data" "200" "false" > /dev/null
fi

# Test 6: Forgot password
forgot_data='{"email": "'${USER_EMAIL}'"}'
test_api "Forgot Password" "POST" "/auth/forgot-password" "$forgot_data" "200" "false" > /dev/null

# Test 7: Resend OTP
test_api "Resend OTP" "POST" "/auth/resend-otp" "" "200" "true" > /dev/null

# Test 8: Verify email (will fail without real OTP, expecting 400)
verify_data='{"otp": "123456"}'
test_api "Verify Email (Invalid OTP)" "POST" "/auth/verify-email" "$verify_data" "400" "true" > /dev/null

# Test 9: Change password
change_pwd_data='{
  "oldPassword": "TestPass@123",
  "newPassword": "NewTestPass@456"
}'
test_api "Change Password" "POST" "/auth/change-password" "$change_pwd_data" "200" "true" > /dev/null

# Test 10: Login with invalid credentials
invalid_login='{
  "email": "nonexistent@example.com",
  "password": "wrongpassword"
}'
test_api "Login with Invalid Credentials" "POST" "/auth/login" "$invalid_login" "401" "false" > /dev/null

# Test 11: Register duplicate user (should fail)
test_api "Register Duplicate User" "POST" "/auth/register" "$register_data" "409" "false" > /dev/null

# Test 12: Logout
test_api "User Logout" "POST" "/auth/logout" "" "200" "true" > /dev/null

# ==========================================
# TEST 13-15: USER MANAGEMENT
# ==========================================

echo ""
echo "=========================================="
echo "User Management Tests"
echo "=========================================="

# Re-login to get fresh token
login_response=$(test_api "Re-login for User Tests" "POST" "/auth/login" "$login_data" "200" "false")
ACCESS_TOKEN=$(echo "$login_response" | jq -r '.data.accessToken // empty' 2>/dev/null)

# Test 13: Get all users
test_api "Get All Users" "GET" "/users" "" "200" "true" > /dev/null

# Test 14: Get user by ID (placeholder)
test_api "Get User by ID" "GET" "/users/123" "" "200" "true" > /dev/null

# Test 15: Update user profile (placeholder)
update_data='{"firstName": "Updated", "lastName": "Name"}'
test_api "Update User Profile" "PATCH" "/users/me" "$update_data" "200" "true" > /dev/null

# ==========================================
# TEST 16-20: COURSE MANAGEMENT
# ==========================================

echo ""
echo "=========================================="
echo "Course Management Tests"
echo "=========================================="

# Test 16: Get all courses
test_api "Get All Courses" "GET" "/courses" "" "200" "false" > /dev/null

# Test 17: Get courses with filters
test_api "Get Courses (Filtered)" "GET" "/courses?category=programming&level=BEGINNER" "" "200" "false" > /dev/null

# Test 18: Get course by ID
test_api "Get Course by ID" "GET" "/courses/test-course-id" "" "200" "false" > /dev/null

# Test 19: Create course (requires teacher role, will likely fail with 403)
create_course='{
  "title": "Test Course",
  "description": "Test Description",
  "category": "Programming",
  "level": "BEGINNER",
  "price": 2999
}'
test_api "Create Course (Student Role)" "POST" "/courses" "$create_course" "200" "true" > /dev/null

# Test 20: Update course
update_course='{"title": "Updated Course Title"}'
test_api "Update Course" "PATCH" "/courses/test-course-id" "$update_course" "200" "true" > /dev/null

# ==========================================
# TEST 21-24: ENROLLMENTS
# ==========================================

echo ""
echo "=========================================="
echo "Enrollment Tests"
echo "=========================================="

# Test 21: Get enrollments
test_api "Get Enrollments" "GET" "/enrollments" "" "200" "true" > /dev/null

# Test 22: Enroll in course
enroll_data='{"courseId": "test-course-id"}'
test_api "Enroll in Course" "POST" "/enrollments" "$enroll_data" "200" "true" > /dev/null

# Test 23: Get my courses
test_api "Get My Courses" "GET" "/enrollments/my-courses" "" "200" "true" > /dev/null

# Test 24: Update progress
progress_data='{"lessonId": "test-lesson-id", "completed": true}'
test_api "Update Lesson Progress" "POST" "/enrollments/test-enrollment-id/progress" "$progress_data" "200" "true" > /dev/null

# ==========================================
# TEST 25-27: LIVE CLASSES
# ==========================================

echo ""
echo "=========================================="
echo "Live Classes Tests"
echo "=========================================="

# Test 25: Get live classes
test_api "Get Live Classes" "GET" "/live-classes" "" "200" "true" > /dev/null

# Test 26: Schedule live class
schedule_class='{
  "courseId": "test-course-id",
  "title": "Test Class",
  "scheduledAt": "2025-12-01T10:00:00Z",
  "duration": 60
}'
test_api "Schedule Live Class" "POST" "/live-classes" "$schedule_class" "200" "true" > /dev/null

# Test 27: Join live class
test_api "Join Live Class" "POST" "/live-classes/test-class-id/join" "" "200" "true" > /dev/null

# ==========================================
# TEST 28-31: TESTS & QUIZZES
# ==========================================

echo ""
echo "=========================================="
echo "Tests & Quizzes Tests"
echo "=========================================="

# Test 28: Get tests
test_api "Get Tests" "GET" "/tests" "" "200" "true" > /dev/null

# Test 29: Get test by ID
test_api "Get Test Details" "GET" "/tests/test-test-id" "" "200" "true" > /dev/null

# Test 30: Submit test
submit_test='{
  "answers": [{"questionId": "q1", "selectedOptions": ["opt1"]}]
}'
test_api "Submit Test" "POST" "/tests/test-test-id/submit" "$submit_test" "200" "true" > /dev/null

# Test 31: Create test
create_test='{
  "courseId": "test-course-id",
  "title": "Test Quiz",
  "type": "QUIZ",
  "duration": 30
}'
test_api "Create Test" "POST" "/tests" "$create_test" "200" "true" > /dev/null

# ==========================================
# TEST 32-35: PAYMENTS
# ==========================================

echo ""
echo "=========================================="
echo "Payment Tests"
echo "=========================================="

# Test 32: Get payment routes
test_api "Get Payments" "GET" "/payments" "" "200" "true" > /dev/null

# Test 33: Create payment order
create_order='{"courseId": "test-course-id", "couponCode": "SAVE20"}'
test_api "Create Payment Order" "POST" "/payments/create-order" "$create_order" "200" "true" > /dev/null

# Test 34: Verify payment
verify_payment='{
  "orderId": "order_123",
  "paymentId": "pay_456",
  "signature": "sig_789"
}'
test_api "Verify Payment" "POST" "/payments/verify" "$verify_payment" "200" "true" > /dev/null

# Test 35: Get payment history
test_api "Get Payment History" "GET" "/payments/history" "" "200" "true" > /dev/null

# ==========================================
# TEST 36-38: DASHBOARDS
# ==========================================

echo ""
echo "=========================================="
echo "Dashboard Tests"
echo "=========================================="

# Test 36: Student dashboard
test_api "Student Dashboard" "GET" "/dashboard/student" "" "200" "true" > /dev/null

# Test 37: Teacher dashboard
test_api "Teacher Dashboard" "GET" "/dashboard/teacher" "" "200" "true" > /dev/null

# Test 38: Admin dashboard
test_api "Admin Dashboard" "GET" "/dashboard/admin" "" "200" "true" > /dev/null

# ==========================================
# TEST 39-41: ANALYTICS
# ==========================================

echo ""
echo "=========================================="
echo "Analytics Tests"
echo "=========================================="

# Test 39: Get analytics
test_api "Get Analytics" "GET" "/analytics" "" "200" "true" > /dev/null

# Test 40: Course analytics
test_api "Course Analytics" "GET" "/analytics/course/test-course-id" "" "200" "true" > /dev/null

# Test 41: Student performance
test_api "Student Performance" "GET" "/analytics/student/test-student-id" "" "200" "true" > /dev/null

# ==========================================
# TEST 42-44: NOTIFICATIONS
# ==========================================

echo ""
echo "=========================================="
echo "Notification Tests"
echo "=========================================="

# Test 42: Get notifications
test_api "Get Notifications" "GET" "/notifications" "" "200" "true" > /dev/null

# Test 43: Mark as read
test_api "Mark Notification as Read" "PATCH" "/notifications/test-notif-id/read" "" "200" "true" > /dev/null

# Test 44: Mark all as read
test_api "Mark All as Read" "PATCH" "/notifications/read-all" "" "200" "true" > /dev/null

# ==========================================
# TEST 45-47: AI SERVICES
# ==========================================

echo ""
echo "=========================================="
echo "AI Services Tests"
echo "=========================================="

# Test 45: Get AI routes
test_api "Get AI Services" "GET" "/ai" "" "200" "true" > /dev/null

# Test 46: Generate content
generate_content='{
  "type": "lesson",
  "topic": "Python Variables",
  "level": "BEGINNER"
}'
test_api "Generate AI Content" "POST" "/ai/generate-content" "$generate_content" "200" "true" > /dev/null

# Test 47: Resolve doubt
resolve_doubt='{
  "courseId": "test-course-id",
  "question": "What is Python?"
}'
test_api "AI Doubt Resolution" "POST" "/ai/resolve-doubt" "$resolve_doubt" "200" "true" > /dev/null

# ==========================================
# TEST 48-50: ERROR HANDLING
# ==========================================

echo ""
echo "=========================================="
echo "Error Handling Tests"
echo "=========================================="

# Test 48: 404 Not Found
test_api "404 Not Found" "GET" "/nonexistent-route" "" "404" "false" > /dev/null

# Test 49: Unauthorized access
test_api "Unauthorized Access" "GET" "/auth/me" "" "401" "false" > /dev/null

# Test 50: Invalid JSON
test_api "Invalid JSON Body" "POST" "/auth/login" '{"invalid": json}' "400" "false" > /dev/null

# ==========================================
# FINAL SUMMARY
# ==========================================

echo ""
echo "=========================================="
echo "TEST SUMMARY"
echo "=========================================="
echo -e "Total Tests: ${TOTAL_TESTS}"
echo -e "${GREEN}Passed: ${PASSED_TESTS}${NC}"
echo -e "${RED}Failed: ${FAILED_TESTS}${NC}"

SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo -e "Success Rate: ${SUCCESS_RATE}%"

# Update report with summary
cat >> "$TEST_REPORT" << EOF

## Final Summary

- **Total Tests:** ${TOTAL_TESTS}
- **Passed:** ${PASSED_TESTS} ✅
- **Failed:** ${FAILED_TESTS} ❌
- **Success Rate:** ${SUCCESS_RATE}%

---

## Test Categories

| Category | Tests |
|----------|-------|
| Health Check | 1 |
| Authentication | 11 |
| User Management | 3 |
| Course Management | 5 |
| Enrollments | 4 |
| Live Classes | 3 |
| Tests & Quizzes | 4 |
| Payments | 4 |
| Dashboards | 3 |
| Analytics | 3 |
| Notifications | 3 |
| AI Services | 3 |
| Error Handling | 3 |

---

**Test Execution Time:** ${TIMESTAMP}  
**Report Generated:** $(date "+%Y-%m-%d %H:%M:%S")

EOF

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Test Report Generated${NC}"
echo "=========================================="
echo ""
echo "Report saved to: $TEST_REPORT"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the report for details.${NC}"
    exit 1
fi
