#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5001"
API_URL="${BASE_URL}/api/v1"

# Output file for results
OUTPUT_FILE="api-test-results.json"
echo "{" > $OUTPUT_FILE
echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"," >> $OUTPUT_FILE
echo "  \"tests\": [" >> $OUTPUT_FILE

# Counter for tests
TEST_COUNT=0

# Function to print section header
print_header() {
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

# Function to run test
run_test() {
    local test_name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local headers=$5
    
    echo -e "${YELLOW}Testing: ${test_name}${NC}"
    echo "Request: ${method} ${endpoint}"
    
    if [ "$TEST_COUNT" -gt 0 ]; then
        echo "," >> $OUTPUT_FILE
    fi
    
    echo "    {" >> $OUTPUT_FILE
    echo "      \"test\": \"${test_name}\"," >> $OUTPUT_FILE
    echo "      \"method\": \"${method}\"," >> $OUTPUT_FILE
    echo "      \"endpoint\": \"${endpoint}\"," >> $OUTPUT_FILE
    
    if [ -n "$data" ]; then
        echo "      \"request_body\": ${data}," >> $OUTPUT_FILE
        if [ -n "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X ${method} "${endpoint}" \
                -H "Content-Type: application/json" \
                ${headers} \
                -d "${data}")
        else
            response=$(curl -s -w "\n%{http_code}" -X ${method} "${endpoint}" \
                -H "Content-Type: application/json" \
                -d "${data}")
        fi
    else
        if [ -n "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X ${method} "${endpoint}" ${headers})
        else
            response=$(curl -s -w "\n%{http_code}" -X ${method} "${endpoint}")
        fi
    fi
    
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    echo "      \"status_code\": ${http_code}," >> $OUTPUT_FILE
    echo "      \"response\": ${response_body}" >> $OUTPUT_FILE
    echo "    }" >> $OUTPUT_FILE
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Status: ${http_code}${NC}"
    else
        echo -e "${RED}✗ Status: ${http_code}${NC}"
    fi
    
    echo "Response: ${response_body}" | head -c 200
    echo "..."
    echo ""
    
    TEST_COUNT=$((TEST_COUNT + 1))
}

# Store tokens for authenticated requests
ACCESS_TOKEN=""
REFRESH_TOKEN=""

print_header "1. HEALTH & INFRASTRUCTURE TESTS"

run_test "Health Check" "GET" "${BASE_URL}/health"

print_header "2. AUTHENTICATION TESTS"

# Register Student
REGISTER_DATA='{
  "name": "Test Student",
  "email": "student@test.com",
  "password": "Test@1234",
  "role": "STUDENT",
  "phone": "+919876543210"
}'
run_test "Register Student" "POST" "${API_URL}/auth/register" "$REGISTER_DATA"

# Register Teacher
REGISTER_TEACHER='{
  "name": "Test Teacher",
  "email": "teacher@test.com",
  "password": "Test@1234",
  "role": "TEACHER",
  "phone": "+919876543211",
  "subjects": ["Mathematics", "Physics"]
}'
run_test "Register Teacher" "POST" "${API_URL}/auth/register" "$REGISTER_TEACHER"

# Register Parent
REGISTER_PARENT='{
  "name": "Test Parent",
  "email": "parent@test.com",
  "password": "Test@1234",
  "role": "PARENT",
  "phone": "+919876543212"
}'
run_test "Register Parent" "POST" "${API_URL}/auth/register" "$REGISTER_PARENT"

# Login
LOGIN_DATA='{
  "email": "student@test.com",
  "password": "Test@1234"
}'
login_response=$(curl -s -X POST "${API_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")

run_test "Login Student" "POST" "${API_URL}/auth/login" "$LOGIN_DATA"

# Extract tokens
ACCESS_TOKEN=$(echo $login_response | jq -r '.data.accessToken // empty')
REFRESH_TOKEN=$(echo $login_response | jq -r '.data.refreshToken // empty')

echo "Access Token: ${ACCESS_TOKEN:0:50}..."
echo ""

# Get Current User (Authenticated)
if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get Current User" "GET" "${API_URL}/auth/me" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

# Refresh Token
if [ -n "$REFRESH_TOKEN" ]; then
    REFRESH_DATA="{\"refreshToken\": \"${REFRESH_TOKEN}\"}"
    run_test "Refresh Token" "POST" "${API_URL}/auth/refresh-token" "$REFRESH_DATA"
fi

# Forgot Password
FORGOT_DATA='{
  "email": "student@test.com"
}'
run_test "Forgot Password" "POST" "${API_URL}/auth/forgot-password" "$FORGOT_DATA"

# Verify Email (will fail without real verification code)
VERIFY_DATA='{
  "email": "student@test.com",
  "verificationCode": "123456"
}'
run_test "Verify Email" "POST" "${API_URL}/auth/verify-email" "$VERIFY_DATA"

# Resend OTP
RESEND_DATA='{
  "email": "student@test.com",
  "type": "email_verification"
}'
run_test "Resend OTP" "POST" "${API_URL}/auth/resend-otp" "$RESEND_DATA"

print_header "3. USER MANAGEMENT TESTS"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get User List" "GET" "${API_URL}/users" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

print_header "4. COURSE TESTS"

run_test "Get Course List" "GET" "${API_URL}/courses"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get Courses (Authenticated)" "GET" "${API_URL}/courses" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

print_header "5. ENROLLMENT TESTS"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get Enrollments" "GET" "${API_URL}/enrollments" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

print_header "6. LIVE CLASS TESTS"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get Live Classes" "GET" "${API_URL}/live-classes" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

print_header "7. TEST TESTS"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get Tests" "GET" "${API_URL}/tests" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

print_header "8. PAYMENT TESTS"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get Payments" "GET" "${API_URL}/payments" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

print_header "9. DASHBOARD TESTS"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get Dashboard Data" "GET" "${API_URL}/dashboard" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

print_header "10. ANALYTICS TESTS"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get Analytics" "GET" "${API_URL}/analytics" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

print_header "11. NOTIFICATION TESTS"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get Notifications" "GET" "${API_URL}/notifications" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

print_header "12. AI TESTS"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Get AI Services" "GET" "${API_URL}/ai" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

print_header "13. ERROR TESTS"

run_test "404 - Invalid Route" "GET" "${API_URL}/invalid-route"
run_test "401 - Unauthorized" "GET" "${API_URL}/auth/me"

print_header "14. LOGOUT TEST"

if [ -n "$ACCESS_TOKEN" ]; then
    run_test "Logout User" "POST" "${API_URL}/auth/logout" "" "-H 'Authorization: Bearer ${ACCESS_TOKEN}'"
fi

# Close JSON file
echo "  ]" >> $OUTPUT_FILE
echo "}" >> $OUTPUT_FILE

print_header "TEST SUMMARY"
echo -e "${GREEN}Total tests executed: ${TEST_COUNT}${NC}"
echo -e "${BLUE}Results saved to: ${OUTPUT_FILE}${NC}"
echo ""
echo "To view formatted results:"
echo "  cat ${OUTPUT_FILE} | jq '.'"
echo ""
