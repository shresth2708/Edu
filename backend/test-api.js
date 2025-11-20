const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5001';
const API_BASE = `${BASE_URL}/api/v1`;

let accessToken = '';
let refreshToken = '';
let userId = '';

const documentation = [];

// Add to documentation
const addDoc = (title, method, endpoint, request, response, auth = false) => {
  const doc = `
### ${title}

**Endpoint:** \`${method} ${endpoint}\`

${auth ? '**Authentication:** Required\n' : ''}
**Request:**
\`\`\`bash
curl -X ${method} \\
  ${API_BASE}${endpoint}${auth ? " \\\n  -H 'Authorization: Bearer <access_token>'" : ''}${request ? " \\\n  -H 'Content-Type: application/json' \\\n  -d '" + JSON.stringify(request, null, 2).replace(/\n/g, '\n  ') + "'" : ''}
\`\`\`

**Response:**
\`\`\`json
${JSON.stringify(response, null, 2)}
\`\`\`

---
`;
  documentation.push(doc);
};

// Test function
const testAPI = async (method, endpoint, data = null, auth = false, description = '') => {
  try {
    console.log(`\n🧪 Testing: ${method} ${endpoint}`);
    
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {},
    };

    if (auth && accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    if (data) {
      config.headers['Content-Type'] = 'application/json';
      config.data = data;
    }

    const response = await axios(config);
    console.log('✅ Success:', response.status);
    
    addDoc(description, method, endpoint, data, response.data, auth);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.status, error.response.data);
      addDoc(description, method, endpoint, data, error.response.data, auth);
      return error.response.data;
    } else {
      console.log('❌ Error:', error.message);
      return { error: error.message };
    }
  }
};

// Main test function
const runTests = async () => {
  console.log('========================================');
  console.log('EduPro+ API Testing & Documentation');
  console.log('========================================');

  // Check server
  try {
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running');
    console.log(JSON.stringify(health.data, null, 2));
    
    documentation.push(`# EduPro+ API Documentation

**Base URL:** \`${API_BASE}\`

**Generated:** ${new Date().toISOString()}

---

## Table of Contents

1. [Health Check](#health-check)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Course Management](#course-management)
5. [Other Modules](#other-modules)

---

## Health Check

### Health Status

**Endpoint:** \`GET /health\`

**Request:**
\`\`\`bash
curl -X GET ${BASE_URL}/health
\`\`\`

**Response:**
\`\`\`json
${JSON.stringify(health.data, null, 2)}
\`\`\`

---

## Authentication

`);
  } catch (error) {
    console.log('❌ Server is not running!');
    console.log('Please start the server: cd backend && npm run dev');
    process.exit(1);
  }

  // ==========================================
  // AUTHENTICATION TESTS
  // ==========================================
  
  console.log('\n========================================');
  console.log('Testing Authentication APIs');
  console.log('========================================');

  // Register
  const registerData = {
    email: `test.${Date.now()}@example.com`,
    password: 'Test@1234',
    firstName: 'Test',
    lastName: 'Student',
    phone: '+919876543210',
    role: 'STUDENT'
  };

  await testAPI('POST', '/auth/register', registerData, false, 'Register New User');

  // Login
  const loginData = {
    email: registerData.email,
    password: registerData.password
  };

  const loginResponse = await testAPI('POST', '/auth/login', loginData, false, 'User Login');

  if (loginResponse.data) {
    accessToken = loginResponse.data.accessToken;
    refreshToken = loginResponse.data.refreshToken;
    userId = loginResponse.data.user?.id;
    console.log('📝 Access token saved');
  }

  // Get Current User
  await testAPI('GET', '/auth/me', null, true, 'Get Current User');

  // Refresh Token
  if (refreshToken) {
    await testAPI('POST', '/auth/refresh-token', { refreshToken }, false, 'Refresh Access Token');
  }

  // Forgot Password
  await testAPI('POST', '/auth/forgot-password', { email: registerData.email }, false, 'Forgot Password');

  // ==========================================
  // USER MANAGEMENT
  // ==========================================
  
  console.log('\n========================================');
  console.log('Testing User Management APIs');
  console.log('========================================');

  documentation.push('\n## User Management\n');

  await testAPI('GET', '/users', null, true, 'Get All Users');

  // ==========================================
  // COURSE MANAGEMENT
  // ==========================================
  
  console.log('\n========================================');
  console.log('Testing Course APIs');
  console.log('========================================');

  documentation.push('\n## Course Management\n');

  await testAPI('GET', '/courses', null, false, 'Get All Courses');

  // ==========================================
  // OTHER MODULES
  // ==========================================
  
  const modules = [
    { path: '/enrollments', title: 'Enrollment' },
    { path: '/live-classes', title: 'Live Classes' },
    { path: '/tests', title: 'Tests' },
    { path: '/payments', title: 'Payments' },
    { path: '/dashboard', title: 'Dashboard' },
    { path: '/analytics', title: 'Analytics' },
    { path: '/notifications', title: 'Notifications' },
    { path: '/ai', title: 'AI Services' }
  ];

  documentation.push('\n## Other Modules\n');

  for (const module of modules) {
    console.log(`\n========================================`);
    console.log(`Testing ${module.title}`);
    console.log(`========================================`);
    
    await testAPI('GET', module.path, null, false, `Get ${module.title}`);
  }

  // Logout
  if (accessToken) {
    await testAPI('POST', '/auth/logout', null, true, 'User Logout');
  }

  // ==========================================
  // SAVE DOCUMENTATION
  // ==========================================
  
  const footer = `

## Error Responses

All endpoints return errors in the following format:

\`\`\`json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
\`\`\`

### Common Status Codes

- \`200\` - Success
- \`201\` - Created
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`403\` - Forbidden
- \`404\` - Not Found
- \`409\` - Conflict
- \`422\` - Validation Error
- \`500\` - Internal Server Error

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per window

---

## Notes

- All timestamps are in ISO 8601 format
- Pagination: Use \`page\` and \`limit\` query parameters
- File uploads use \`multipart/form-data\`
- Maximum request body size: 10MB

---

**Generated:** ${new Date().toISOString()}
`;

  documentation.push(footer);

  const docContent = documentation.join('\n');
  fs.writeFileSync('../API_DOCUMENTATION.md', docContent);

  console.log('\n========================================');
  console.log('✅ Testing Complete!');
  console.log('========================================');
  console.log('\n📄 Documentation saved to: API_DOCUMENTATION.md\n');
};

// Run tests
runTests().catch(console.error);
