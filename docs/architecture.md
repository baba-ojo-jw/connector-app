# Connector — Architecture Notes

## Overview

Connector is built as a set of interconnected services that communicate over REST APIs (HTTP requests and responses).

## Components

### Frontend
- Serves web pages to users (profiles, feeds, settings)
- Built with server-side rendered HTML
- No framework — plain Express templates

### Authentication Service
- Handles all login and signup flows
- Issues JWT (JSON Web Token) session tokens
- Every API request includes a token for identity verification

### Backend API
- Central hub for all data operations
- Endpoints for messages, file uploads, search, and more
- Connects to the database for all reads and writes

### Database
- PostgreSQL database
- Stores users, messages, files, transactions
- All access goes through the Backend API's query engine

### Payment Processor
- Handles premium features and subscriptions
- Currently in testing — not yet live

### Admin Panel
- Internal dashboard for Connector staff
- Separate login system from the main app
- Used for content moderation and user management
