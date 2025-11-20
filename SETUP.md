# 🚀 EduPro+ - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Installation](#detailed-installation)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **PostgreSQL** >= 14.x ([Download](https://www.postgresql.org/download/))
- **MongoDB** >= 6.x ([Download](https://www.mongodb.com/try/download/community))
- **Redis** >= 7.x ([Download](https://redis.io/download/))
- **Git** ([Download](https://git-scm.com/))

---

## Quick Start (Docker - Recommended)

The fastest way to get started is using Docker:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd trial2

# 2. Start all services with Docker Compose
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# API Docs: http://localhost:5000/api/v1
```

That's it! The application is now running with all services configured.

---

## Detailed Installation (Without Docker)

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd trial2
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configurations
nano .env  # or use your preferred editor
```

**Required environment variables:**

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database URLs
DATABASE_URL="postgresql://postgres:password@localhost:5432/edupro?schema=public"
MONGODB_URI="mongodb://localhost:27017/edupro_analytics"

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### 2.3 Database Setup

**PostgreSQL:**

```bash
# Create database
createdb edupro

# Or using psql
psql -U postgres
CREATE DATABASE edupro;
\q
```

**Run Prisma Migrations:**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

**MongoDB:**

MongoDB will auto-create the database on first connection. Just ensure MongoDB is running:

```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

**Redis:**

```bash
# Start Redis (macOS with Homebrew)
brew services start redis

# Or manually
redis-server
```

#### 2.4 Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

#### 3.1 Install Dependencies

```bash
cd ../frontend
npm install
```

#### 3.2 Configure Environment

```bash
# Create .env file
touch .env

# Add the following
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
```

#### 3.3 Start Frontend

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend will run on `http://localhost:3000`

---

## Database Setup

### PostgreSQL Schema

The Prisma schema includes:
- Users (with role-based access)
- Teacher/Student/Parent Profiles
- Courses & Lessons
- Live Classes
- Tests & Questions
- Payments
- Enrollments
- Achievements
- Notifications

### MongoDB Collections

MongoDB is used for:
- Analytics data
- User activity logs
- System logs
- Event tracking

### Redis Cache

Redis is used for:
- Session management
- API rate limiting
- OTP storage
- Temporary data caching

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Database Services:**
```bash
# PostgreSQL
brew services start postgresql

# MongoDB
brew services start mongodb-community

# Redis
brew services start redis
```

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
NODE_ENV=production npm start
```

---

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## API Testing

### Using the Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-11-19T...",
  "services": {
    "database": "connected",
    "redis": "connected",
    "mongodb": "connected"
  }
}
```

### Test Registration

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

---

## Deployment

### Production Checklist

- [ ] Update all environment variables with production values
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure production database URLs
- [ ] Set up SSL certificates
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Set up backup strategy
- [ ] Configure CI/CD pipeline

### Deploy with Docker

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Deploy to Cloud Platforms

**Backend (Node.js):**
- AWS Elastic Beanstalk
- Heroku
- DigitalOcean App Platform
- Railway
- Render

**Frontend (React):**
- Vercel (Recommended)
- Netlify
- AWS Amplify
- CloudFlare Pages

**Database:**
- AWS RDS (PostgreSQL)
- MongoDB Atlas
- Redis Cloud

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=5001 npm run dev
```

#### 2. Database Connection Failed

```bash
# Check if PostgreSQL is running
brew services list

# Restart PostgreSQL
brew services restart postgresql

# Check connection
psql -U postgres -c "SELECT version();"
```

#### 3. Prisma Migration Issues

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Push schema without migration
npx prisma db push
```

#### 4. Redis Connection Failed

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis
brew services start redis
```

#### 5. MongoDB Connection Issues

```bash
# Check if MongoDB is running
brew services list

# Start MongoDB
brew services start mongodb-community

# Test connection
mongosh
```

#### 6. Frontend Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

#### 7. CORS Errors

Ensure `FRONTEND_URL` is correctly set in backend `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

---

## Environment-Specific Configurations

### Development

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Staging

```env
NODE_ENV=staging
PORT=5000
FRONTEND_URL=https://staging.edupro.com
```

### Production

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://edupro.com
```

---

## Performance Optimization

### Backend
- Enable Redis caching
- Use connection pooling
- Implement request pagination
- Optimize database queries
- Enable compression middleware

### Frontend
- Code splitting
- Lazy loading routes
- Image optimization
- Bundle size analysis
- CDN for static assets

---

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable HTTPS in production**
4. **Implement rate limiting**
5. **Sanitize user inputs**
6. **Use parameterized queries**
7. **Enable CORS only for trusted origins**
8. **Regular security audits**
9. **Keep dependencies updated**
10. **Implement 2FA for admin accounts**

---

## Monitoring & Logging

### Backend Logs

Logs are stored in:
- `backend/logs/combined.log` - All logs
- `backend/logs/error.log` - Error logs only
- `backend/logs/exceptions.log` - Unhandled exceptions

### Monitoring Tools (Recommended)

- **Application Monitoring:** Sentry, New Relic
- **Database Monitoring:** Datadog, pgAnalyze
- **Uptime Monitoring:** UptimeRobot, Pingdom
- **Analytics:** Mixpanel, Google Analytics

---

## Support

For issues and questions:
- 📧 Email: support@edupro.com
- 💬 Discord: [Join our community]
- 📖 Documentation: [docs.edupro.com]
- 🐛 Bug Reports: [GitHub Issues]

---

## Next Steps

After successful setup:

1. ✅ Create your first teacher account
2. ✅ Build your first course
3. ✅ Schedule a live class
4. ✅ Invite students
5. ✅ Explore AI features
6. ✅ Check analytics dashboard

---

**Happy Teaching! 🎓✨**
