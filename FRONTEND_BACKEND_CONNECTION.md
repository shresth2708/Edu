# Frontend-Backend Integration Guide

## Setup Complete ✅

The frontend has been successfully connected to the backend APIs.

## What Was Done

### 1. Environment Configuration
- Created `.env` file with `VITE_API_URL=http://localhost:5001/api/v1`
- Updated API base URL to match backend port (5001)

### 2. API Services Created
All service files are in `/frontend/src/services/`:

- ✅ `api.js` - Axios instance with JWT interceptors
- ✅ `authService.js` - Authentication APIs (register, login, logout, etc.)
- ✅ `courseService.js` - Course management APIs
- ✅ `enrollmentService.js` - Enrollment and progress tracking
- ✅ `paymentService.js` - Payment processing
- ✅ `liveClassService.js` - Live class management
- ✅ `testService.js` - Test and quiz APIs
- ✅ `dashboardService.js` - Dashboard data
- ✅ `notificationService.js` - Notifications
- ✅ `userService.js` - User management

### 3. Features Implemented

#### Authentication Flow
- JWT token-based authentication
- Auto token refresh on 401 errors
- Token storage in localStorage
- Protected routes with auth guards

#### API Integration
- Request/response interceptors
- Error handling
- Loading states
- Toast notifications for success/error

#### Components Updated
- Login form → connects to `/api/v1/auth/login`
- Register form → connects to `/api/v1/auth/register`
- All forms properly handle backend response format

### 4. Test Connection Page
Created `/test-connection` page to verify:
- Server health check
- API endpoint connectivity
- Authentication status
- Token validation

## How to Test

### Step 1: Start Backend Server
```bash
cd backend
node test-server.js
```

Server will start on: `http://localhost:5001`

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will start on: `http://localhost:3000`

### Step 3: Test the Connection

#### Visit Test Page:
```
http://localhost:3000/test-connection
```

This page will show:
- ✅ Server health status
- ✅ API endpoint tests
- ✅ Connection information

#### Test Authentication:
1. Go to: `http://localhost:3000/register`
2. Fill in the form:
   - Email: test@example.com
   - Password: Test@1234
   - First Name: John
   - Last Name: Doe
   - Role: Student

3. Click "Create Account"
4. You should be redirected to dashboard

#### Test Login:
1. Go to: `http://localhost:3000/login`
2. Use credentials:
   - Email: test@example.com
   - Password: Test@1234

3. Click "Sign In"
4. You should be redirected to dashboard

## API Endpoints Connected

### Authentication (11 endpoints)
- POST `/auth/register` - User registration
- POST `/auth/login` - User login  
- GET `/auth/me` - Get current user
- POST `/auth/logout` - Logout
- POST `/auth/refresh-token` - Refresh token
- POST `/auth/forgot-password` - Request password reset
- POST `/auth/reset-password` - Reset password
- POST `/auth/change-password` - Change password
- POST `/auth/verify-email` - Verify email
- POST `/auth/verify-otp` - Verify OTP
- POST `/auth/resend-otp` - Resend OTP

### Courses
- GET `/courses` - Get all courses
- GET `/courses/:id` - Get course details
- POST `/courses` - Create course (Teacher)
- PATCH `/courses/:id` - Update course
- DELETE `/courses/:id` - Delete course

### Enrollments
- POST `/enrollments` - Enroll in course
- GET `/enrollments/my-courses` - Get my enrollments
- POST `/enrollments/:id/progress` - Update progress

### Live Classes
- GET `/live-classes` - Get all classes
- POST `/live-classes` - Schedule class (Teacher)
- POST `/live-classes/:id/join` - Join class

### Tests
- GET `/tests` - Get tests by course
- GET `/tests/:id` - Get test details
- POST `/tests/:id/submit` - Submit test

### Payments
- POST `/payments/create-order` - Create payment
- POST `/payments/verify` - Verify payment
- GET `/payments/history` - Payment history

### Dashboard
- GET `/dashboard/student` - Student dashboard
- GET `/dashboard/teacher` - Teacher dashboard
- GET `/dashboard/admin` - Admin dashboard

### Other Modules
- GET `/notifications` - Get notifications
- GET `/users` - Get users (Admin)
- GET `/analytics/*` - Analytics endpoints

## Response Format

All APIs follow this format:

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

## Authentication Headers

For protected endpoints, include JWT token:
```javascript
headers: {
  'Authorization': 'Bearer <access_token>'
}
```

## Next Steps

### To Use Real Database:

1. **Update backend/.env** with actual database URL:
```env
DATABASE_URL='your-postgresql-url'
MONGODB_URI='your-mongodb-url'
REDIS_HOST=localhost
```

2. **Run migrations**:
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

3. **Start real server**:
```bash
cd backend
npm run dev
```

### To Deploy:

1. **Frontend**: Deploy to Vercel/Netlify
   - Set `VITE_API_URL` to production backend URL

2. **Backend**: Deploy to Railway/Render/AWS
   - Set all environment variables
   - Enable CORS for frontend domain

## Troubleshooting

### Backend not responding?
```bash
# Check if server is running
lsof -i :5001

# Kill and restart
kill -9 <PID>
cd backend && node test-server.js
```

### Frontend not connecting?
1. Check `.env` file exists in `/frontend`
2. Verify `VITE_API_URL=http://localhost:5001/api/v1`
3. Restart frontend dev server

### CORS errors?
- Backend has CORS enabled for `http://localhost:3000`
- Update if using different port

## Success Indicators

✅ Test connection page shows all green
✅ Can register new user
✅ Can login with credentials
✅ Receive success toast notifications
✅ Redirected to dashboard after login
✅ Can see user data in dashboard

---

**Status**: Frontend-Backend Integration Complete ✅

**Documentation**: 
- API_DOCUMENTATION.md - Complete API reference
- API_TEST_REPORT.md - cURL test results

**Test Server**: Running on port 5001
**Frontend**: Running on port 3000
