# Connector — Architecture Notes

## Overview

Connector is built as a set of interconnected services that communicate over REST APIs (HTTP requests and responses).

## Components

### Frontend
- Serves web pages to users (profiles, feeds, settings)
- Built with server-side rendered HTML
- No framework — plain Express templates
- Highest traffic component after the Backend API

### Authentication Service
- Handles all login and signup flows
- Issues JWT (JSON Web Token) session tokens
- Every API request includes a token for identity verification
- Single point of entry for all 80,000+ daily active users

### Backend API
- Central hub for all data operations
- Endpoints for messages, file uploads, search, and more
- Processes ~200,000 requests/day
- Connects to the database for all reads and writes

### Database
- PostgreSQL database
- Stores users, messages, files, transactions
- Internal only — not directly accessible from the internet
- All access goes through the Backend API's query engine

### Payment Processor
- Handles premium features and subscriptions
- Currently in testing — not yet live
- Scheduled to launch in Q2
- Zero production traffic today

### Admin Panel
- Internal dashboard for Connector staff
- Very low traffic (~12 requests/day)
- Separate login system from the main app
- Used for content moderation and user management

## Key Design Decisions

1. **Single database** — All services share one PostgreSQL instance. This simplifies development but means a database compromise affects everything.

2. **JWT for sessions** — Tokens are stateless (the server doesn't track them). This scales well but makes token revocation difficult.

3. **No API gateway** — Services communicate directly. There's no central point for rate limiting or access control.

4. **Shared query module** — `src/database/queries.js` is used by all services. A vulnerability there affects the entire system.

## Traffic Patterns (Week of March 1-7, 2026)

| Component | Daily Requests | Trend |
|---|---|---|
| Backend API | 200,000 | Stable |
| Auth Service | 50,000 | Surging (8x from last week) |
| Frontend | 35,000 | Surging (viral post) |
| DM Endpoint | 28,000 | Growing fast |
| Search | 18,000 | Stable |
| File Upload | 6,500 | Stable |
| Payment | 0 | Not live |
| Admin Panel | 12 | Stable |
