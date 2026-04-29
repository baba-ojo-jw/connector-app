# Connector

A social platform built for teens. This repository contains the backend services, frontend code, and infrastructure that power the app.

> **Note:** "Connector" is the internal codename. The public-facing product name is decided by each team.

---

## Architecture

The diagram below shows how the major components of Connector communicate with each other.

```mermaid
graph TD
    USER["User (Browser / Mobile App)"]

    subgraph FRONTEND["Frontend"]
        FE_PROFILE["Profile Page"]
        FE_ERRORS["Error Handler"]
    end

    subgraph AUTH["Authentication Service"]
        AUTH_LOGIN["Login Endpoint"]
        AUTH_SESSION["Session Manager"]
    end

    subgraph API["Backend API"]
        API_MESSAGES["Direct Messages"]
        API_UPLOAD["File Upload"]
        API_SEARCH["Search"]
    end

    subgraph DB["Database"]
        DB_QUERIES["Query Engine"]
        DB_USERS["User Records"]
    end

    subgraph PAYMENTS["Payment Processor"]
        PAY_PROCESS["Transaction Handler"]
    end

    subgraph ADMIN["Admin Panel"]
        ADMIN_LOGIN["Admin Login"]
        ADMIN_DEPS["Dependencies"]
    end

    USER -->|"HTTP requests"| FRONTEND
    USER -->|"Login / Signup"| AUTH_LOGIN
    AUTH_LOGIN -->|"Create / validate token"| AUTH_SESSION
    AUTH_SESSION -->|"Token check on every request"| API

    FRONTEND -->|"REST API calls"| API
    API_MESSAGES -->|"Read / write messages"| DB_QUERIES
    API_UPLOAD -->|"Store file metadata"| DB_QUERIES
    API_SEARCH -->|"Query users & posts"| DB_QUERIES
    DB_QUERIES -->|"Read / write"| DB_USERS

    API -->|"Process payments"| PAY_PROCESS
    PAY_PROCESS -->|"Store transaction records"| DB_QUERIES

    ADMIN_LOGIN -->|"Staff-only access"| API
    ADMIN_DEPS -.->|"Logging library v1.2"| API

    style AUTH fill:#ff6b6b,stroke:#c0392b,color:#fff
    style API fill:#f39c12,stroke:#e67e22,color:#fff
    style FRONTEND fill:#3498db,stroke:#2980b9,color:#fff
    style DB fill:#2ecc71,stroke:#27ae60,color:#fff
    style PAYMENTS fill:#9b59b6,stroke:#8e44ad,color:#fff
    style ADMIN fill:#95a5a6,stroke:#7f8c8d,color:#fff
```

### How It Works

| Component | What It Does | Traffic Level |
|---|---|---|
| **Frontend** | Serves the web pages users see — profiles, feeds, settings | ~35,000 requests/day |
| **Authentication Service** | Handles login, signup, and session tokens | ~50,000 requests/day |
| **Backend API** | The central hub — messages, uploads, search all go through here | ~200,000 requests/day |
| **Database** | Stores everything — users, messages, files, transactions | Internal only |
| **Payment Processor** | Will handle subscriptions and purchases | Not yet live |
| **Admin Panel** | Internal dashboard for staff to manage the platform | ~12 requests/day |

### Communication Pattern

All components communicate over **REST APIs** (HTTP requests and responses). When a user logs in:

1. The browser sends credentials to the **Authentication Service**
2. Auth validates the password and creates a **session token**
3. Every subsequent request includes that token so the **Backend API** knows who's asking
4. The API reads/writes data from the **Database** and returns it to the **Frontend**

---

## Project Structure

```
connector-app/
├── README.md               ← You are here
├── package.json            ← Project dependencies
├── src/
│   ├── auth/
│   │   ├── login.js        ← Handles user login
│   │   └── session.js      ← Manages session tokens
│   ├── api/
│   │   ├── messages.js     ← Direct message endpoints
│   │   ├── upload.js       ← File upload handling
│   │   └── search.js       ← Search endpoint
│   ├── frontend/
│   │   ├── profile.js      ← Profile page rendering
│   │   └── errors.js       ← Error display handling
│   ├── database/
│   │   ├── queries.js      ← Database query builder
│   │   └── users.js        ← User data management
│   ├── payments/
│   │   └── processor.js    ← Payment transaction handling
│   └── admin/
│       ├── login.js        ← Admin authentication
│       └── dependencies.json ← Admin panel dependencies
└── docs/
    └── architecture.md     ← Detailed architecture notes
```

---

## Running Locally

```bash
npm install
npm start
```

The app starts on `http://localhost:3000` by default.

---

## Known Issues

This codebase has **12 known security vulnerabilities** (CVEs) that have been identified but not yet fixed. Your job is to review them, understand the risk each one poses, and decide which ones to fix first.

The full CVE list is provided separately as part of your raw materials.

---

## Team

- **CEO:** Maya Okonkwo
- **Engineering:** 2 engineers (that's it — prioritization matters)
