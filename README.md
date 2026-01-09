# PrimeTrade - Enterprise-Ready Task Management SaaS

A production-ready, full-stack Task Management application built with Next.js 15, Node.js, Express, and MongoDB, demonstrating senior-level engineering patterns.

## 🚀 Key Features

### Security & Architecture
- **Stateless HTTP-only Auth**: JWT tokens stored in `http-only`, `secure`, `same-site` cookies for maximum RSC/CSR protection.
- **Server-Side Protection**: Next.js Middleware for zero-flicker route protection.
- **Security Headers**: Integrated `Helmet` on the backend to prevent XSS, Clickjacking, and more.
- **Robust Validation**: `Express Optimizer` and `Zod` (frontend) mirroring for strict schema enforcement.
- **Standardized API**: Consistent response envelope `{ success: boolean, data: any, errors?: [] }`.

### User Experience
- **SaaS-Style Dashboard**: Modern sidebar layout with micro-animations via `Framer Motion`.
- **Advanced Task CRUD**: Search by title, filter by status, and optimistic-feeling toggles.
- **Responsive Mastery**: Tailored experiences for mobile, tablet, and desktop.
- **Profile Management**: Secure profile updates with hashed password persistence.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Axios, Lucide, Framer Motion.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, BcryptJS, Express Validator, Helmet, Cookie Parser.

## 📦 Getting Started

### Prerequisites
- Node.js v19+
- MongoDB instance (Local or Atlas)

### Setup

1. **Clone & Install**
   ```bash
   git clone <repo_url>
   cd PrimeTrade
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update your MongoDB URI in .env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 📈 Scaling Strategy for Production

As a Senior Engineer, I would evolve this architecture for scale using the following pillars:

### 1. API & Backend Scalability
- **API Versioning**: Introduce `/api/v1/` to ensure backward compatibility as the mobile app or third-party integrations grow.
- **Redis Caching**: Implement Redis for session caching and to store frequently accessed task lists, reducing database I/O.
- **Rate Limiting**: Use `express-rate-limit` to prevent brute force on auth endpoints and DDoS on CRUD.
- **Microservices Transition**: Decouple the `Auth` service from `Task` management to allow independent scaling based on load (auth is compute-heavy, tasks are I/O-heavy).

### 2. Frontend Performance
- **TanStack Query**: Replace raw Axios calls with `React Query` for standardized caching, background revalidation, and built-in loading/error states.
- **Streaming & Suspense**: Leverage Next.js 15 `<Suspense>` to stream dashboard components independently, improving Time to First Byte (TTFB).
- **Code Splitting**: Dynamic imports for heavy components like charts or complex modals to reduce main bundle size.

### 3. Infrastructure & DevOps
- **Containerization**: Dockerize both apps for consistent environments and orchestrate with Kubernetes (EKS/GKE) for auto-scaling.
- **CI/CD**: GitHub Actions pipeline with automated linting, type-checking, and unit tests (Jest/Vitest) before deployment.
- **Observability**: Integrate OpenTelemetry or New Relic for distributed tracing and Sentry for real-time error monitoring.

## 📄 API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/register` | Create account & set HTTP-only cookie |
| POST | `/login` | Authenticate & set HTTP-only cookie |
| POST | `/logout` | Clear session cookie |
| GET | `/me` | Get current user (from cookie) |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | Fetch tasks (Search/Filter via query) |
| POST | `/` | Create a new task |
| PUT | `/:id` | Update task or toggle completion |
| DELETE | `/:id` | Permanently remove task |

---

Developed for the PrimeTrade Frontend Intern Selection Process.
