# AWS Route 53 Clone

A functional clone of the AWS Route 53 web application, built to
reproduce the Route 53 user experience and core hosted-zone/DNS-record
workflows.

The project focuses on **UI/UX similarity, backend API design,
persistent storage, authentication, and maintainable application
structure** rather than implementing real DNS resolution.

## Live Demo

**Frontend:** https://aws-route53-clone-ruby.vercel.app

**Backend / Swagger:**
https://aws-route53-clone-production-64a8.up.railway.app/docs

**Demo credentials**

-   Email: `demo@route53clone.com`
-   Password: `Route53@123`

> This project is a simulated Route 53 console. DNS records are stored
> and managed as application data; the application does not perform real
> DNS hosting or resolution.

------------------------------------------------------------------------

## Features

### Authentication

-   Login
-   Logout
-   Session persistence
-   Protected API routes
-   HTTP-only session cookie
-   Production cookie configuration for cross-origin frontend/backend
    deployment

### Hosted Zones

Full CRUD functionality:

-   View hosted zones
-   Search hosted zones by name
-   Pagination
-   Create hosted zones
-   Edit hosted zones
-   Delete hosted zones
-   Public/private visibility representation
-   Automatic creation of default `NS` and `SOA` records when a hosted
    zone is created

### DNS Records

Full CRUD functionality within a hosted zone:

-   View records
-   Search records
-   Filter by record type
-   Pagination
-   Create records
-   Edit records
-   Delete records

Supported record types include:

-   A
-   AAAA
-   CNAME
-   TXT
-   MX
-   NS
-   PTR
-   SRV
-   CAA

### Route 53-style Experience

-   AWS-style dark header
-   Route 53 navigation/sidebar
-   Hosted zone and record tables
-   Search and filters
-   Pagination
-   Create/edit forms
-   Context menus
-   Hover/pointer interactions
-   Notifications and UI states
-   Placeholder sections for non-core Route 53 features

### Mocked Sections

-   Dashboard
-   Traffic Policies
-   Health Checks
-   Resolver
-   Profiles

These sections are presented as placeholders because they are outside
the core assignment scope.

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   Next.js
-   TypeScript
-   React
-   Tailwind CSS
-   Lucide React

### Backend

-   FastAPI
-   Python
-   SQLAlchemy
-   Pydantic
-   Uvicorn
-   Passlib / bcrypt

### Database

-   SQLite
-   SQLAlchemy ORM

### Deployment

-   Vercel --- Next.js frontend
-   Railway --- FastAPI backend
-   Railway Volume --- persistent SQLite storage

------------------------------------------------------------------------

## Architecture

``` text
                         ┌─────────────────────────────┐
                         │           Vercel            │
                         │      Next.js Frontend       │
                         │                             │
                         │ Login / Hosted Zones /      │
                         │ DNS Records / UI            │
                         └──────────────┬──────────────┘
                                        │
                                  HTTPS / REST
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │          Railway            │
                         │       FastAPI Backend       │
                         │                             │
                         │ Routers → Services → ORM    │
                         │ Authentication              │
                         │ Hosted Zones                │
                         │ DNS Records                 │
                         └──────────────┬──────────────┘
                                        │
                                   SQLAlchemy
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │       Railway Volume        │
                         │                             │
                         │      /data/route53.db      │
                         │          SQLite             │
                         └─────────────────────────────┘
```

### Request Flow

``` text
Browser
   │
   ▼
Next.js Frontend
   │
   │ credentials: include
   ▼
FastAPI Router
   │
   │ authentication / validation
   ▼
Service Layer
   │
   ▼
SQLAlchemy
   │
   ▼
SQLite
```

The backend separates HTTP routing from application logic and database
persistence.

------------------------------------------------------------------------

## Project Structure

``` text
aws-route53-clone/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── hosted-zones/
│   │   │   └── ...
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── session.py
│   │   │   ├── hosted_zone.py
│   │   │   └── dns_record.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── hosted_zones.py
│   │   │   └── dns_records.py
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── auth.py
│   │   │   ├── hosted_zone.py
│   │   │   └── dns_record.py
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   └── route53.db
│
└── README.md
```

------------------------------------------------------------------------

# Database Schema

The application uses SQLite with SQLAlchemy ORM.

## Entity Relationship

``` text
┌──────────────┐
│    users     │
└──────┬───────┘
       │
       │ 1 : N
       ▼
┌──────────────┐
│ hosted_zones │
└──────┬───────┘
       │
       │ 1 : N
       ▼
┌──────────────┐
│ dns_records  │
└──────────────┘

users
  │
  │ 1 : N
  ▼
sessions
```

### `users`

Stores application users and authentication information.

Key data includes:

-   User ID
-   Email
-   Password hash
-   Role

Passwords are stored as hashes rather than plaintext.

### `sessions`

Stores authenticated application sessions used to maintain login state.

Sessions are associated with users and represented to the browser
through an HTTP-only cookie.

### `hosted_zones`

Stores hosted zones owned by users.

Key fields:

-   `id`
-   `name`
-   `description`
-   `visibility`
-   `user_id`
-   `created_at`
-   `updated_at`

Relationship:

``` text
users.id → hosted_zones.user_id
```

### `dns_records`

Stores DNS records belonging to a hosted zone.

Key fields:

-   `id`
-   `hosted_zone_id`
-   `name`
-   `type`
-   `ttl`
-   `value`
-   `created_at`
-   `updated_at`

Relationship:

``` text
hosted_zones.id → dns_records.hosted_zone_id
```

A hosted zone can contain multiple DNS records.

### Production Persistence

Locally:

``` text
backend/route53.db
```

Production:

``` text
/data/route53.db
```

The production path is mounted to a Railway persistent volume, so the
SQLite database survives container restarts and redeployments.

------------------------------------------------------------------------

# API Overview

The backend is implemented using FastAPI and exposes interactive Swagger
documentation.

**Production API**

`https://aws-route53-clone-production-64a8.up.railway.app`

**Swagger**

`https://aws-route53-clone-production-64a8.up.railway.app/docs`

All protected endpoints require an authenticated session.

## Authentication

  Method   Endpoint             Description
  -------- -------------------- ------------------------------------------
  POST     `/api/auth/login`    Authenticate a user and create a session
  GET      `/api/auth/me`       Return the current authenticated user
  POST     `/api/auth/logout`   End the current session

## Hosted Zones

  Method   Endpoint                        Description
  -------- ------------------------------- ------------------------------------------
  POST     `/api/hosted-zones`             Create a hosted zone
  GET      `/api/hosted-zones`             List/search hosted zones with pagination
  GET      `/api/hosted-zones/{zone_id}`   Get a hosted zone
  PUT      `/api/hosted-zones/{zone_id}`   Update a hosted zone
  DELETE   `/api/hosted-zones/{zone_id}`   Delete a hosted zone

### Hosted Zone Query Parameters

The list endpoint supports:

``` text
search
page
limit
```

Example:

``` text
GET /api/hosted-zones?search=scaler&page=1&limit=10
```

## DNS Records

  ---------------------------------------------------------------------------------------------------
  Method                  Endpoint                                            Description
  ----------------------- --------------------------------------------------- -----------------------
  POST                    `/api/hosted-zones/{zone_id}/records`               Create a DNS record

  GET                     `/api/hosted-zones/{zone_id}/records`               List/search/filter
                                                                              records

  GET                     `/api/hosted-zones/{zone_id}/records/{record_id}`   Get a DNS record

  PUT                     `/api/hosted-zones/{zone_id}/records/{record_id}`   Update a DNS record

  DELETE                  `/api/hosted-zones/{zone_id}/records/{record_id}`   Delete a DNS record
  ---------------------------------------------------------------------------------------------------

### DNS Record Query Parameters

The list endpoint supports:

``` text
search
type
page
limit
```

Example:

``` text
GET /api/hosted-zones/1/records?type=A&page=1&limit=10
```

## Health Check

``` text
GET /health
```

Returns:

``` json
{
  "status": "ok"
}
```

------------------------------------------------------------------------

# Authentication Flow

``` text
Login form
    │
    ▼
POST /api/auth/login
    │
    ├── Validate credentials
    ├── Create session
    └── Set HTTP-only cookie
    │
    ▼
Authenticated browser session
    │
    ▼
Protected API requests
    │
    ▼
GET /api/auth/me
```

The frontend sends requests with credentials included so the session
cookie can be used for authenticated API calls.

For production deployment, the session cookie uses secure cross-origin
settings.

------------------------------------------------------------------------

# Hosted Zone Workflow

Creating a hosted zone performs:

``` text
Create Hosted Zone
        │
        ▼
Persist Hosted Zone
        │
        ├───────────────┐
        ▼               ▼
   Create NS        Create SOA
     Record           Record
        │               │
        └───────┬───────┘
                ▼
        Commit transaction
```

The NS/SOA values are simulated for this clone and are not used for
actual DNS resolution.

------------------------------------------------------------------------

# Local Development Setup

## Prerequisites

-   Node.js
-   npm
-   Python 3.11+
-   Git

## 1. Clone

``` bash
git clone https://github.com/girishgarg12/aws-route53-clone.git
cd aws-route53-clone
```

## 2. Backend

``` bash
cd backend
```

Create a virtual environment:

### Windows

``` powershell
python -m venv .venv
.venv\Scriptsctivate
```

### macOS / Linux

``` bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

Run FastAPI:

``` bash
uvicorn app.main:app --reload --port 8000
```

Backend:

``` text
http://localhost:8000
```

Swagger:

``` text
http://localhost:8000/docs
```

## 3. Frontend

Open another terminal:

``` bash
cd frontend
npm install
```

Create:

``` text
frontend/.env.local
```

``` env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run:

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# Environment Variables

## Frontend

Local:

``` env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Production:

``` env
NEXT_PUBLIC_API_URL=https://aws-route53-clone-production-64a8.up.railway.app
```

The production value is configured in Vercel and is not committed to the
repository.

## Backend

Production:

``` env
DATABASE_URL=sqlite:////data/route53.db
ENVIRONMENT=production
```

The SQLite file is stored on the Railway persistent volume.

------------------------------------------------------------------------

# Production Deployment

## Frontend --- Vercel

Production URL:

``` text
https://aws-route53-clone-ruby.vercel.app
```

The Vercel project uses:

``` text
Root Directory: frontend
```

Production API variable:

``` env
NEXT_PUBLIC_API_URL=https://aws-route53-clone-production-64a8.up.railway.app
```

## Backend --- Railway

Production API:

``` text
https://aws-route53-clone-production-64a8.up.railway.app
```

The backend runs FastAPI with Uvicorn and listens on the
Railway-provided port.

## Persistent Storage

The Railway Volume is mounted at:

``` text
/data
```

Database:

``` text
/data/route53.db
```

This keeps application data across backend redeployments.

------------------------------------------------------------------------

# UI / UX

The frontend intentionally follows the AWS console visual language:

-   Dark AWS-style top navigation
-   Orange AWS branding
-   Route 53 sidebar
-   Light gray application background
-   AWS-inspired spacing and typography
-   Resource-oriented tables
-   Search and filter controls
-   Pagination
-   Create/edit forms
-   Context menus
-   Loading/error states
-   Placeholder pages for mocked sections

The goal was to make the application feel like a Route 53 management
console rather than a generic CRUD dashboard.

------------------------------------------------------------------------

# Evaluation Criteria Coverage

  -----------------------------------------------------------------------
  Evaluation Area                     Implementation
  ----------------------------------- -----------------------------------
  UI similarity to Route 53           AWS-style header, sidebar, tables,
                                      forms, menus and
                                      resource-management screens

  Frontend engineering                Next.js + TypeScript + reusable
                                      application structure

  Backend/API design                  FastAPI routers, schemas, services
                                      and authenticated endpoints

  Database design                     SQLite + SQLAlchemy with users,
                                      sessions, hosted zones and DNS
                                      records

  Code quality                        Separation of routing, services,
                                      schemas and models

  Documentation                       Setup, architecture, database
                                      schema and API documentation

  Overall completeness                Authentication, Hosted Zones, DNS
                                      Records, search, filtering,
                                      pagination and deployment
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Bonus / Future Improvements

Potential extensions include:

-   Import DNS records from BIND zone files
-   Export hosted zones as JSON or BIND format
-   Bulk DNS record operations
-   Dark mode
-   Keyboard shortcuts
-   Automated tests
-   CI/CD checks
-   Additional Route 53 resource simulations

------------------------------------------------------------------------

# Repository

GitHub:

https://github.com/girishgarg12/aws-route53-clone

# Demo

Frontend:

https://aws-route53-clone-ruby.vercel.app

Backend / Swagger:

https://aws-route53-clone-production-64a8.up.railway.app/docs

------------------------------------------------------------------------

## Disclaimer

This is an educational clone created for the AWS Route 53 assignment.

It recreates the Route 53 console experience and core
resource-management workflows but does not provide actual DNS hosting,
AWS IAM integration, or real DNS resolution.
