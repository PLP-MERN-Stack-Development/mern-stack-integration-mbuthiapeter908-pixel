# 📝 MERN Blog - Full Stack Blog Application

A modern, full-stack blog application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, rich text editing, image uploads, and a responsive design with dark mode support.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| **Frontend (Vercel)** | [https://week-4-mern-blog.vercel.app](https://week-4-mern-blog.vercel.app) |
| **Backend API (Render)** | [https://mern-blog-backendhwbt.onrender.com/api](https://mern-blog-backendhwbt.onrender.com/api) |
| **Health Check** | [https://mern-blog-backendhwbt.onrender.com/api/health](https://mern-blog-backendhwbt.onrender.com/api/health) |
| **GitHub Repo** | [https://github.com/mbuthiapeter908-pixel/mern-blog-backend](https://github.com/mbuthiapeter908-pixel/mern-blog-backend) |

---

## ✨ Features

### 📱 Frontend Features
- **Modern UI/UX** — Built with React 18 and Tailwind CSS
- **Dark/Light Mode** — Theme toggle with system preference detection
- **Authentication** — Secure user authentication with Clerk
- **Blog Posts** — Create, read, update, and delete posts
- **Categories** — Organize posts by categories with color coding
- **Comments System** — Engage with readers through comments
- **Image Uploads** — Featured images stored on Cloudinary
- **Responsive Design** — Mobile-first approach, works on all devices
- **Loading States** — Beautiful skeleton loaders and spinners
- **Error Handling** — User-friendly error messages and fallbacks

### 🔧 Backend Features
- **RESTful API** — Well-structured API endpoints
- **MongoDB Integration** — Mongoose ODM with proper schemas
- **Authentication** — Clerk integration for user management
- **File Uploads** — Cloudinary for persistent image storage
- **Data Validation** — Comprehensive input validation
- **Error Handling** — Centralized error handling middleware
- **Pagination** — Paginated responses for posts and comments
- **Search & Filter** — Advanced filtering capabilities

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — UI library
- **Vite** — Build tool and development server
- **Tailwind CSS** — Styling
- **Clerk** — Authentication
- **React Router v6** — Routing
- **date-fns** — Date formatting
- **Context API** — State management (theme)

### Backend
- **Node.js** — Runtime environment
- **Express.js** — Web framework
- **MongoDB Atlas** — Database
- **Mongoose** — ODM
- **Clerk SDK** — Authentication verification
- **Cloudinary** — Image storage
- **Multer** — File upload handling
- **CORS** — Cross-origin resource sharing

---

## 📂 Project Structure

```
mern-blog/
├── frontend/                # React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── layout/      # Layout components (Header, Footer)
│   │   │   ├── posts/       # Post-related components
│   │   │   ├── comments/    # Comment components
│   │   │   ├── categories/  # Category components
│   │   │   └── ui/          # UI components (spinners, skeletons)
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React context providers
│   │   ├── lib/             # Utilities and API client
│   │   └── App.jsx          # Main app component
│   └── package.json
│
├── backend/                 # Express API
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   └── server.js            # Server entry point
│
└── README.md
```

---

## 🔌 API Endpoints

### Posts
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/posts` | Get all posts | Public |
| GET | `/api/posts/slug/:slug` | Get post by slug | Public |
| GET | `/api/posts/id/:id` | Get post by ID | Public |
| GET | `/api/posts/user/:userId` | Get user's posts | Public |
| POST | `/api/posts` | Create new post | Required |
| PUT | `/api/posts/:id` | Update post | Owner/Admin |
| DELETE | `/api/posts/:id` | Delete post | Owner/Admin |

### Categories
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:slug` | Get category by slug | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Comments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/comments/post/:postId` | Get post comments | Public |
| GET | `/api/comments/user/:userId` | Get user's comments | Public |
| POST | `/api/comments` | Create comment | Required |
| PUT | `/api/comments/:id` | Update comment | Owner |
| DELETE | `/api/comments/:id` | Delete comment | Owner/Admin |
| PUT | `/api/comments/:id/moderate` | Moderate comment | Admin |
| POST | `/api/comments/:id/like` | Like/unlike comment | Required |
| POST | `/api/comments/:id/report` | Report comment | Required |

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variables:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=https://mern-blog-backendhwbt.onrender.com/api
```

### Backend (Render)
1. Go to [render.com](https://render.com) and create a new **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add environment variables:
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLIENT_URL=https://week-4-mern-blog.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🏗️ Local Development

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Clerk account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mbuthiapeter908-pixel/mern-blog-backend.git
cd mern-blog
```

2. **Set up environment variables**

Backend (`.env` in backend folder):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Frontend (`.env` in frontend folder):
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
```

3. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

4. **Run the development servers**
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Author

**Peter Mbuthia**
- GitHub: [@mbuthiapeter908-pixel](https://github.com/mbuthiapeter908-pixel)

---

## 🙏 Acknowledgments

- [MongoDB](https://www.mongodb.com)
- [Express.js](https://expressjs.com)
- [React](https://reactjs.org)
- [Node.js](https://nodejs.org)
- [Clerk](https://clerk.dev)
- [Cloudinary](https://cloudinary.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel](https://vercel.com)
- [Render](https://render.com)