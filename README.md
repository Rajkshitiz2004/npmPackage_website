# API Response Kit Playground

An interactive, production-quality developer demonstration platform showcasing **`api-response-kit-kshitiz` (v1.0.0)** published on NPM.

- **NPM Package**: [`api-response-kit-kshitiz`](https://www.npmjs.com/package/api-response-kit-kshitiz)
- **Version**: `1.0.0`
- **Installation**: `npm install api-response-kit-kshitiz`
- **License**: MIT
- **Academic Context**: College Software Engineering / Application Software Development (ASD) Portfolio Project by **Kshitiz Raj** (ADYPU, Year 2 / Sem-3).

---

## 1. Project Overview

**API Response Kit Playground** allows developers, evaluators, and students to interactively test, inspect, and evaluate standardized Node.js API responses in real time.

Instead of simulating or hardcoding responses on the frontend, the platform features a complete **Express.js backend** that directly imports and executes the published NPM package: `api-response-kit-kshitiz@1.0.0`.

### Key Benefits of the Package:
1. **Zero Runtime Dependencies**: Ultra-lean, minimal attack surface, fast cold-starts.
2. **Predictable JSON Envelopes**: Standardizes `success()`, `error()`, and timestamps across microservices.
3. **Safe Mathematical Pagination**: `paginate()` calculates `totalPages`, `hasNextPage`, `hasPreviousPage`, and boundaries cleanly.
4. **Express.js Integration**: `sendSuccess(res, ...)` and `sendError(res, ...)` simultaneously write HTTP status headers and JSON payloads.
5. **Async Safety**: `asyncHandler(fn)` and custom `ApiError` class work seamlessly with `errorHandler` to catch rejections and protect against stack trace leaks.

---

## 2. Architecture & Technology Stack

```text
api-response-kit/
├── backend/                     # Modular Express.js Backend Service
│   ├── src/
│   │   ├── app.js               # Express application setup, routes & middleware
│   │   ├── server.js            # Server entrypoint (listening on port 5000)
│   │   ├── controllers/
│   │   │   ├── demo.controller.js       # Playground demonstration routes
│   │   │   ├── users.controller.js      # User management controllers
│   │   │   └── products.controller.js   # E-commerce catalog controllers
│   │   ├── routes/
│   │   │   ├── demo.routes.js
│   │   │   ├── users.routes.js
│   │   │   └── products.routes.js
│   │   ├── data/
│   │   │   ├── users.js         # 60 sample user records (in-memory)
│   │   │   └── products.js      # 30 sample product records (in-memory)
│   │   └── middleware/
│   │       └── error.middleware.js # Express error handler integration
│   ├── tests/
│   │   └── api.test.js          # 11 automated integration tests (Node.js test runner)
│   ├── package.json             # Depends on api-response-kit-kshitiz@1.0.0
│   └── .env.example
│
├── frontend/                    # Modern React.js (Vite) Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Responsive brand header & navigation
│   │   │   ├── Footer.jsx       # Footer with academic & package context
│   │   │   ├── CodeBlock.jsx    # Syntax-highlighted code with copy button
│   │   │   ├── JsonViewer.jsx   # Interactive JSON viewer with compact/expand
│   │   │   └── FeatureCard.jsx  # Reusable card component
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page with hero, workflow & architecture
│   │   │   ├── Playground.jsx   # 2-panel interactive API sandbox
│   │   │   ├── Documentation.jsx# Searchable reference for all 9 package methods
│   │   │   ├── UseCases.jsx     # User management, E-Commerce & Auth modules
│   │   │   └── Testing.jsx      # Test suite dashboard & package quality metrics
│   │   ├── services/
│   │   │   └── api.js           # Axios client with execution time instrumentation
│   │   ├── App.jsx              # Client-side router configuration
│   │   ├── main.jsx
│   │   └── index.css            # Tailwind CSS design system
│   ├── package.json
│   └── vite.config.js
│
├── src/                         # Original NPM Package Source Code (CommonJS)
├── tests/                       # Package 19 Unit Tests (node:test)
├── package.json                 # api-response-kit-kshitiz package manifest
└── README.md                    # Root Documentation
```

### Stack Breakdown
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router DOM.
- **Backend**: Node.js (>= 18), Express 4, `api-response-kit-kshitiz@1.0.0`, CORS, Dotenv.
- **Testing**: Built-in `node:test` runner and Node native Fetch API.

---

## 3. Getting Started Locally

### Prerequisites
- Node.js version 18.0.0 or later
- NPM version 9.0.0 or later

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/api-response-kit.git
cd api-response-kit
```

### Step 2: Set Up and Start the Express Backend
The backend installs and consumes `api-response-kit-kshitiz` directly from the NPM registry.

```bash
cd backend
npm install
npm run dev
```
> The backend server starts on **`http://localhost:5000`**.

Verify backend health in your terminal or browser:
```bash
curl http://localhost:5000/api/health
```

### Step 3: Set Up and Start the React Frontend
In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
> The frontend application launches on **`http://localhost:5173`**.

Open [http://localhost:5173](http://localhost:5173) in your browser to explore the playground.

---

## 4. API Endpoints Reference

| HTTP Method | Route | Description | NPM Method Used |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & metadata | `sendSuccess()` |
| `GET` | `/api/package-info` | Package version, dependencies, exports | `sendSuccess()` |
| `GET` | `/api/run-tests` | Verified test run verification endpoint | `sendSuccess()` |
| `GET` | `/api/demo/success` | Standard 200 OK profile response | `sendSuccess()` |
| `GET` | `/api/demo/error?status=...` | Error responses (400, 401, 403, 404, 422, 500) | `sendError()` |
| `GET` | `/api/demo/pagination?page=..` | Mathematical pagination calculation | `paginate()` |
| `GET` | `/api/demo/users?page=..` | Paginated in-memory dataset of 60 users | `paginatedResponse()` |
| `GET` | `/api/demo/express?type=..` | Direct Express helper demonstration | `sendSuccess()`, `sendError()` |
| `GET` | `/api/demo/async-error?mode=..`| Async error handling with `ApiError` & masking | `asyncHandler()`, `ApiError`, `errorHandler` |
| `GET` | `/api/users` | List users with pagination and search | `paginatedResponse()` |
| `GET` | `/api/users/:id` | Fetch user by ID (or 404 ApiError) | `sendSuccess()`, `ApiError` |
| `GET` | `/api/products` | Paginated products catalog by category | `paginatedResponse()` |
| `GET` | `/api/products/:id` | Fetch product details by ID | `sendSuccess()`, `ApiError` |
| `POST`| `/api/demo/auth/login` | Authentication simulation endpoint | `sendSuccess()`, `sendError()` |

---

## 5. Automated Testing

### Running Root Package Tests (19 Tests)
```bash
# In the root repository folder
npm test
```
Verifies all 19 unit test assertions for response generation, pagination edge cases, Express helpers, and error handling.

### Running Backend Integration Tests (11 Tests)
```bash
# In the backend/ folder
cd backend
npm test
```
Executes 11 end-to-end HTTP integration tests verifying real endpoint status codes, JSON contracts, and error masking.

---

## 6. Website Pages Guide

1. **Home (`/`)**:
   - Hero banner with copyable `npm install api-response-kit-kshitiz` snippet.
   - Dual split-view preview of Express route code and real JSON response.
   - 5-step developer lifecycle (Install → Import → Configure → Execute → Standardize).
   - Core architectural cards and zero runtime dependency highlights.

2. **Interactive API Playground (`/playground`)**:
   - Left panel: Scenario selector (Success, Error, Pagination, Paginated Users, Express, Async Error), dynamic input controls, parameter sliders.
   - Right panel: Live response viewer, measured latency in milliseconds, HTTP status code badges, JSON syntax highlighting with copy & compact toggles, Express route code, and response headers.
   - Visual pagination controller that syncs with backend pagination metadata.

3. **API Documentation (`/docs`)**:
   - Interactive sidebar with live search filtering.
   - Detailed specifications for all 9 exported methods (`success`, `error`, `paginate`, `paginatedResponse`, `sendSuccess`, `sendError`, `ApiError`, `asyncHandler`, `errorHandler`).
   - Signature, parameter tables, defaults, returns, use cases, code examples, and JSON samples.

4. **Real-World Use Cases (`/use-cases`)**:
   - **User Management**: Fetch user by ID, simulate missing user (404), and browse 60 paginated users.
   - **E-Commerce**: Product details, invalid product ID, category filtering, and catalog pagination.
   - **Authentication Simulation**: 200 OK login with JWT simulation, 400 Bad Request on missing fields, and 401 Unauthorized on bad credentials.

5. **Package & Testing Dashboard (`/testing`)**:
   - Package metadata (v1.0.0, CommonJS, zero runtime dependencies, MIT license).
   - 19 verified test results from release verification.
   - Live backend test re-verification trigger.

---

## 7. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 8. Limitations & Scope

- **Database-Free Design**: Uses fast in-memory datasets (60 users, 30 products) for zero-configuration local execution.
- **Authentication**: The authentication demonstration simulates realistic response envelopes and does not store passwords or integrate OAuth.
- **Node Environment**: Targeted for Node.js 18+ CommonJS.

---

## 9. Author & Credits

- **Developer**: Kshitiz Raj
- **NPM Package**: [`api-response-kit-kshitiz@1.0.0`](https://www.npmjs.com/package/api-response-kit-kshitiz)
- **Institution**: Ajeenkya DY Patil University (ADYPU) - Year 2, Semester 3 (ASD)
- **License**: MIT
