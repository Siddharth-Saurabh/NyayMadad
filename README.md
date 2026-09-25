# NyayMadad — AI-Powered Crime Reporting & Complaint Routing System

> **Tagline:** *"Tell us what happened. We’ll help you report it."*

**NyayMadad** is a secure, citizen-centric digital platform designed to remove the friction and legal complexity of reporting crimes and civil grievances. Citizens simply describe what occurred in everyday language or spoken voice. An assistive AI pipeline extracts facts, identifies missing details, and drafts a structured complaint for citizen review. A rules-based **deterministic routing engine** then dispatches the report to the competent jurisdictional department.

---

## 🏛️ Core Architectural Principles

1. **AI Assists; Humans Decide**: AI provides transcription, fact extraction, and draft synthesis. It **never** determines legal outcomes, guilt, or innocence, and **never** makes autonomous routing decisions.
2. **Deterministic Jurisdiction Routing**: Incident category, subcategory, and location are routed using explicit, auditable administrative rules—preventing LLM routing hallucinations.
3. **Protected Evidence & Cryptographic Integrity**: All uploaded documents, screenshots, audio files, and video proof are hashed with **SHA-256** upon intake to ensure tamper-proof chain of custody.
4. **Full Role-Based Access Control (RBAC)**: Strict server-side separation between `citizen`, `officer`, `department_admin`, and `system_admin`.
5. **Immutable Audit Trail**: Every sensitive action (evidence download, status transition, officer assignment, routing change) generates a timestamped, auditable record.
6. **Zero-Friction Offline/Mock Mode**: The entire platform runs seamlessly out-of-the-box with mock AI, speech, storage, and database fallbacks when third-party cloud credentials are not supplied.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, TanStack Query, Lucide Icons, Web Audio API |
| **Backend** | Node.js (ESM), Express.js, Socket.IO, Multer, Helmet, CORS, Morgan |
| **Database** | MongoDB Atlas / Embedded Mongoose, In-Memory Caching & Redis Adapter |
| **AI & NLP** | Google Gemini API (`@google/generative-ai`) + Fallback Deterministic AI Provider |
| **Speech-to-Text** | Gemini Multimodal Audio Transcriber + Web Speech / Mock Transcription Provider |
| **Authentication** | Clerk Authentication SDK + Role-Based Context & Multi-Persona Switcher |
| **Containerization** | Docker, Multi-Stage Builds, Docker Compose |
| **Orchestration** | Kubernetes Deployments, Services, ConfigMaps, Secrets, Ingress |
| **CI/CD** | GitLab CI/CD Pipeline |
| **Testing** | Jest, Supertest |

---

## 📂 Project Structure

```text
NyayMadad/
├── client/                     # React + Vite Frontend Application
│   ├── src/
│   │   ├── api/                # Axios client & request interceptors
│   │   ├── components/         # Navbar, Footer, StatusBadge, TimelineView, EvidenceUploader
│   │   ├── context/            # AuthContext & Multi-Persona Switcher
│   │   ├── pages/              # Citizen & Authority Views
│   │   │   ├── LandingPage.jsx
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── ReportWizard.jsx
│   │   │   ├── ComplaintTrackingPage.jsx
│   │   │   ├── AuthorityDashboard.jsx
│   │   │   ├── AuthorityComplaintDetail.jsx
│   │   │   ├── AdminRoutingRulesPage.jsx
│   │   │   └── AdminAuditLogsPage.jsx
│   │   ├── App.jsx             # Route definitions & guards
│   │   ├── main.jsx
│   │   └── index.css           # Civic design system tokens
│   ├── Dockerfile
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── src/
│   │   ├── config/             # DB, Redis, Env & Clerk configurations
│   │   ├── controllers/        # Auth, AI, Complaints, Evidence, Authority, Admin
│   │   ├── middleware/         # Auth verification, RBAC, Error handling
│   │   ├── models/             # Mongoose schemas with indexes (Complaint, User, Evidence...)
│   │   ├── providers/          # Provider abstractions (AI, Speech, Storage, Identity)
│   │   ├── routes/             # REST endpoints (/api/auth, /api/complaints, etc.)
│   │   ├── scripts/            # Database seed script for demo units & cases
│   │   ├── services/           # Complaint, Routing, Evidence & AI business logic
│   │   ├── utils/              # Status State Machine, Custom Errors, Safe Logger
│   │   ├── app.js              # Express app factory
│   │   └── server.js           # HTTP + Socket.IO server startup
│   ├── tests/                  # Jest & Supertest integration test suites
│   ├── Dockerfile
│   └── package.json
│
├── k8s/                        # Production Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── server-deployment.yaml
│   └── client-deployment.yaml
│
├── .gitlab-ci.yml              # Multi-stage CI/CD pipeline
├── docker-compose.yml          # Containerized local dev stack
├── README.md
└── package.json                # Root workspace scripts
```

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
- **Node.js**: v18 or v20+
- **npm**: v9+
- *(Optional)* Docker & Docker Compose

### 2. Installation
Install all dependencies for root, server, and client with a single command:
```bash
npm run install:all
```

### 3. Environment Configuration
Create the environment files from templates:

**Server** (`server/.env`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nyaymadad?retryWrites=true&w=majority
REDIS_URL=redis://localhost:6379
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
STORAGE_PROVIDER=local
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_API_URL=/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
```

### 4. Database Seeding
Populate fictional demo departments (*Cyber Crime Unit*, *Metropolitan Police*, *Women & Child Safety Unit*, *Financial Fraud Wing*), routing rules, officers, and sample cases:
```bash
npm run server:seed
```

### 5. Running Locally
Run both the backend API and frontend Vite server concurrently:
```bash
# Start backend on http://localhost:5000
npm run server:dev

# Start frontend on http://localhost:5173
npm run client:dev
```

---

## 🎭 Multi-Role Demo Personas

NyayMadad includes a built-in persona switcher in the top navigation bar for testing all system workflows without authentication hurdles:

1. **Citizen (`Aarav Sharma`)**: File complaints by voice or text, answer AI follow-up questions, attach evidence, and track case progress.
2. **Investigating Officer (`Inspector Vikram Rathore`)**: Access the Cyber Crime queue, review AI-extracted facts vs original statement, download evidence, and request clarification.
3. **Department Admin (`ACP Priya Mukherjee`)**: Assign cases to active officers, manage department workflows, and transfer cases.
4. **System Admin (`Rajesh Nambiar`)**: Maintain deterministic routing rules, inspect immutable security audit logs, and oversee platform health.

---

## 🧪 Automated Testing

Run the full integration and unit test suite:
```bash
npm run server:test
```

Tests cover:
- Health check & service readiness
- AI text analysis & entity extraction with fallback resilience
- Citizen complaint creation, draft edits, submission & deterministic routing
- Authority metrics, officer assignment, status transitions, and information requests
- Admin routing rule queries

---

## 🐳 Docker & Containerization

Start the complete application stack (Backend, Frontend, and Redis) with Docker Compose:
```bash
docker compose up --build
```
- **Web App**: `http://localhost`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`

---

## 🚢 Kubernetes Deployment

Deploy to a Kubernetes cluster:
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/server-deployment.yaml
kubectl apply -f k8s/client-deployment.yaml
```

---

## 🔒 Security & Privacy Features

- **No Raw Sensitive PII in Logs**: Centralized logger automatically redacts passwords, tokens, OTPs, and private keys.
- **SHA-256 Evidence Hashing**: Every upload computes a 256-bit cryptographic digest recorded in the database.
- **Controlled State Machine**: Status transitions follow a strict directed graph (`DRAFT` → `SUBMITTED` → `ROUTED` → `UNDER_REVIEW` → `INVESTIGATION` → `RESOLVED` → `CLOSED`).
- **Emergency 112 Redirection**: If the AI detects immediate physical danger, a high-priority banner and one-click 112 helpline modal are presented upfront.

---

## 📜 License
NyayMadad is developed for public safety and civic justice innovation.
