# EduPro+ - AI-Powered Teaching & Learning Platform

A next-generation SaaS platform for educators and students with AI automation, gamification, and advanced analytics.

## 🚀 Features

### For Teachers
- ✅ **AI-Powered Course Builder** - Auto-generate lessons, quizzes, and content
- ✅ **Live Classes** - Conduct interactive sessions with whiteboard and screen sharing
- ✅ **Advanced Analytics** - Track student progress and engagement
- ✅ **Payment Integration** - Razorpay & Stripe support
- ✅ **Content Protection** - DRM, watermarking, and anti-piracy
- ✅ **Custom Branding** - White-label your academy

### For Students
- ✅ **Personalized Dashboard** - AI-recommended learning paths
- ✅ **Gamification** - XP, badges, streaks, and leaderboards
- ✅ **Live Classes** - Interactive learning experience
- ✅ **24/7 AI Tutor** - Get instant help with doubts
- ✅ **Progress Tracking** - Monitor your learning journey
- ✅ **Offline Mode** - Download lessons for offline viewing

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- Prisma ORM
- PostgreSQL (relational data)
- MongoDB (analytics & logs)
- Redis (caching)
- Socket.io (real-time features)
- JWT Authentication

### Frontend
- React.js 18
- Redux Toolkit (state management)
- React Router v6
- Tailwind CSS
- Framer Motion (animations)
- Vite (build tool)

### Infrastructure
- Docker
- AWS S3 (file storage)
- AWS CloudFront (CDN)
- Razorpay/Stripe (payments)

## 📦 Project Structure

```
trial2/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── mongodb.js
│   │   │   └── redis.js
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── course.routes.js
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   └── logger.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── layouts/
    │   │   ├── MainLayout.jsx
    │   │   ├── AuthLayout.jsx
    │   │   └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   ├── dashboard/
    │   │   └── public/
    │   ├── store/
    │   │   ├── slices/
    │   │   └── index.js
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   └── courseService.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🚦 Getting Started

### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 14.x
- MongoDB >= 6.x
- Redis >= 7.x
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/edupro"
MONGODB_URI="mongodb://localhost:27017/edupro_analytics"
JWT_SECRET=your-secret-key
```

5. Run Prisma migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

6. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📝 API Documentation

### Authentication Endpoints

```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - Login user
POST   /api/v1/auth/logout            - Logout user
POST   /api/v1/auth/refresh-token     - Refresh access token
GET    /api/v1/auth/me                - Get current user
POST   /api/v1/auth/verify-email      - Verify email with OTP
POST   /api/v1/auth/forgot-password   - Request password reset
POST   /api/v1/auth/reset-password    - Reset password
POST   /api/v1/auth/change-password   - Change password
```

### Course Endpoints (Coming Soon)

```
GET    /api/v1/courses               - Get all courses
GET    /api/v1/courses/:slug         - Get course by slug
POST   /api/v1/courses               - Create course (Teacher only)
PUT    /api/v1/courses/:id           - Update course (Teacher only)
DELETE /api/v1/courses/:id           - Delete course (Teacher only)
```

## 🔐 Environment Variables

### Backend Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `REDIS_HOST` | Redis host | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | Optional |
| `RAZORPAY_KEY_ID` | Razorpay key | Optional |
| `STRIPE_SECRET_KEY` | Stripe secret key | Optional |

## 🔧 Available Scripts

### Backend

```bash
npm start         # Start production server
npm run dev       # Start development server with nodemon
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm test          # Run tests
```

### Frontend

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint code
```

## 🐳 Docker Deployment

Coming soon...

## 📊 Database Schema

The platform uses:
- **PostgreSQL** for relational data (users, courses, enrollments, etc.)
- **MongoDB** for analytics, logs, and event tracking
- **Redis** for caching and session management

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@edupro.com or join our Discord community.

## 🎯 Roadmap

### Phase 1 (MVP) - Completed ✅
- Authentication system
- Basic dashboard layouts
- Database schema
- API structure

### Phase 2 (In Progress) 🚧
- Course management
- Live classes integration
- Payment gateway
- File upload system

### Phase 3 (Planned) 📋
- AI quiz generator
- Gamification system
- Advanced analytics
- Mobile app

### Phase 4 (Future) 🔮
- AI tutor chatbot
- Peer mentorship
- Marketplace
- AR/VR modules

## 🌟 Why EduPro+ is Better than Classplus

| Feature | Classplus | EduPro+ |
|---------|-----------|---------|
| AI Tools | ❌ | ✅ Advanced |
| Gamification | ❌ | ✅ Full System |
| Open Source | ❌ | ✅ Yes |
| Custom Branding | Paid | ✅ Included |
| Analytics | Basic | ✅ Advanced |
| Global Ready | Limited | ✅ Multi-currency |

---

Made with ❤️ by the EduPro+ Team
# Edu
